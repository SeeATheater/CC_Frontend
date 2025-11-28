export async function uploadImageToS3(file, uploadUrl) {
	const putRes = await fetch(uploadUrl, {
		method: 'PUT',
		headers: {
			'Content-Type': file.type,
		},
		body: file,
	});

	if (!putRes.ok) {
		const errorText = await putRes.text();
		throw new Error(`S3 업로드 실패: ${putRes.status} - ${errorText}`);
	}
}
