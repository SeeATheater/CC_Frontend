
import { API_ENDPOINTS } from './apiConfig.js';
import axios from 'axios';

// 유틸리티 함수들
const getFileExtension = (file) => {
  return file.name.split('.').pop().toLowerCase();
};

const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('JPG, JPEG, PNG 형식만 지원됩니다.');
  }

  if (file.size > maxSize) {
    throw new Error('파일 크기는 10MB 이하여야 합니다.');
  }

  return true;
};

const validateImageFiles = (files) => {
  if (!files || files.length === 0) {
    throw new Error('선택된 파일이 없습니다.');
  }
  if (files.length > 5) {
    throw new Error('이미지는 최대 5개까지 업로드할 수 있습니다.');
  }
  files.forEach((file, index) => {
    try {
      validateImageFile(file);
    } catch (error) {
      throw new Error(`파일 ${index + 1}: ${error.message}`);
    }
  });
  return true;
};

/**
 * S3 URL에서 keyName 추출
 * URL 형식 예시: 
 * - https://bucket.s3.region.amazonaws.com/board/uuid.png
 * - https://bucket.s3.amazonaws.com/board/uuid.png
 * keyName 형식: "board/uuid.png"
 */
const extractKeyNameFromUrl = (url) => {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    // pathname은 "/board/uuid.png" 형태
    // 맨 앞의 "/" 제거
    const keyName = urlObj.pathname.substring(1);
    
    // keyName이 유효한지 확인 (최소한 "folder/file.ext" 형태)
    if (keyName && keyName.includes('/')) {
      return keyName;
    }
    
    // fallback: URL 마지막 2개 세그먼트 사용
    const segments = url.split('/');
    if (segments.length >= 2) {
      return segments.slice(-2).join('/');
    }
    
    return null;
  } catch (error) {
    // URL 파싱 실패 시 기존 방식으로 fallback
    const segments = url.split('/');
    if (segments.length >= 2) {
      return segments.slice(-2).join('/');
    }
    return null;
  }
};

// Presigned URL 관련 함수들
const getSinglePresignedUrl = async (fetchData, file) => {
  const extension = getFileExtension(file);
  const response = await fetchData(
    `${API_ENDPOINTS.PRESIGNED_URL}?imageExtension=${extension}&filePath=board`,
    'GET'
  );
  // axios response(.data) || wrapper(.result) || raw response
  return response.data || response.result || response;
};

const getMultiplePresignedUrls = async (fetchData, files) => {
  if (!files || files.length === 0) return [];
  const extensions = files.map(getFileExtension);
  const response = await fetchData(
    `${API_ENDPOINTS.PRESIGNED_URLS}?filePath=board`,
    'POST',
    extensions
  );
  
  const urlsData = response.data || response.result || response;

  if (!Array.isArray(urlsData)) {
    console.error('Presigned URL 응답 구조 에러:', response); // 디버깅용 로그
    throw new Error('Presigned URL 응답 형식이 올바르지 않습니다.');
  }
  return urlsData;
};

// S3에 파일 업로드
const uploadFileToS3 = async (uploadUrl, file) => {
  try {
    let contentType = file.type;
    
    if (!contentType) {
       const extension = getFileExtension(file);
       // jpg의 경우 표준인 image/jpeg로 변환해주는 안전장치
       if (extension === 'jpg') {
         contentType = 'image/jpeg';
       } else {
         contentType = `image/${extension}`;
       }
    }
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error('S3 업로드 실패:', error.response || error);
    throw new Error('파일 업로드에 실패했습니다.');
  }
};

// 3. 단일 이미지 업로드 함수 (필드명 매핑)
export const uploadSingleImage = async (fetchData, file) => {
  try {
    validateImageFile(file);
    const urlData = await getSinglePresignedUrl(fetchData, file);

    // 서버 응답 키(imageUrl)와 코드 변수 매핑
    const uploadUrl = urlData.uploadUrl || urlData.presignedUrl;
    const keyName = urlData.keyName;
    const publicUrl = urlData.imageUrl || urlData.publicUrl; // imageUrl 우선 확인

    if (!uploadUrl) throw new Error('업로드 URL을 받아오지 못했습니다.');

    await uploadFileToS3(uploadUrl, file);

    return {
      keyName: keyName,
      imageUrl: publicUrl,
    };
  } catch (error) {
    console.error('단일 이미지 업로드 실패:', error);
    throw error;
  }
};

// 4. 다중 이미지 업로드 함수 (필드명 매핑)
export const uploadMultipleImages = async (fetchData, files) => {
  try {
    if (!files || files.length === 0) return [];
    validateImageFiles(files);

    const urlsData = await getMultiplePresignedUrls(fetchData, files);
    if (urlsData.length !== files.length) {
      throw new Error('Presigned URL 수와 파일 수가 일치하지 않습니다.');
    }

    const uploadPromises = files.map(async (file, index) => {
      const urlData = urlsData[index];
      
      // 서버 응답 키 매핑 (uploadUrl, keyName, imageUrl)
      const uploadUrl = urlData.uploadUrl || urlData.presignedUrl;
      const keyName = urlData.keyName;
      const publicUrl = urlData.imageUrl || urlData.publicUrl; // imageUrl 추가

      if (!uploadUrl || !keyName) {
        throw new Error(`Presigned URL 정보가 누락되었습니다 (파일 ${index + 1})`);
      }

      await uploadFileToS3(uploadUrl, file);
      
      // DB 저장용 객체 반환
      return { keyName: keyName, imageUrl: publicUrl };
    });

    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults;
  } catch (error) {
    console.error('다중 이미지 업로드 실패:', error);
    throw error;
  }
};

// 게시글 작성용 - PartialImageRequestDTO 형식에 맞춤 (keyName만 필요)
export const processImagesForCreate = async (fetchData, files) => {
  try {
    if (!files || files.length === 0) return [];
    const uploadResults = await uploadMultipleImages(fetchData, files);
    // PartialImageRequestDTO는 keyName만 필요
    return uploadResults.map((result) => ({
      keyName: result.keyName,
    }));
  } catch (error) {
    console.error('게시글 작성용 이미지 처리 실패:', error);
    throw error;
  }
};

// 게시글 수정용 - PartialImageRequestDTO 형식에 맞춤 (keyName만 필요)
export const processImagesForUpdate = async (fetchData, existingImages = [], newFiles = []) => {
  try {
    const imageRequestDTOs = [];
    
    // 1. 기존 이미지 처리 - URL에서 keyName 추출
    existingImages.forEach((img) => {
      const url = img.url || img.imageUrl;
      
      // 이미 keyName이 있으면 사용, 없으면 URL에서 추출
      let keyName = img.keyName;
      
      if (!keyName && url) {
        keyName = extractKeyNameFromUrl(url);
      }
      
      if (keyName) {
        // PartialImageRequestDTO는 keyName만 필요
        imageRequestDTOs.push({ keyName: keyName });
        console.log('기존 이미지 keyName 추가:', keyName);
      } else {
        console.warn('keyName을 추출할 수 없는 이미지:', img);
      }
    });

    // 2. 새 파일 업로드 및 추가
    if (newFiles && newFiles.length > 0) {
      const newUploadResults = await uploadMultipleImages(fetchData, newFiles);
      newUploadResults.forEach((result) => {
        // PartialImageRequestDTO는 keyName만 필요
        imageRequestDTOs.push({ keyName: result.keyName });
        console.log('새 이미지 keyName 추가:', result.keyName);
      });
    }
    
    console.log('최종 imageRequestDTOs:', imageRequestDTOs);
    return imageRequestDTOs;
  } catch (error) {
    console.error('게시글 수정용 이미지 처리 실패:', error);
    throw error;
  }
};

// S3 이미지 삭제
export const deleteImageFromS3 = async (fetchData, keyName) => {
  try {
    await fetchData(API_ENDPOINTS.IMAGE_DELETE(keyName), 'DELETE');
  } catch (error) {
    console.error('S3 이미지 삭제 실패:', error);
    throw error;
  }
};

// S3 존재 확인
export const checkImageExists = async (fetchData, keyName) => {
  try {
    const response = await fetchData(`${API_ENDPOINTS.IMAGE_EXISTS}?keyName=${keyName}`, 'GET');
    return response.result || response;
  } catch (error) {
    console.error('S3 객체 존재 확인 실패:', error);
    return false;
  }
};

export { validateImageFile, validateImageFiles, extractKeyNameFromUrl };
