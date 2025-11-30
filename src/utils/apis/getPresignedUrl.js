export async function getPresignedUrl(axiosClient, imageExtension, filePath) {
	const url = `${import.meta.env.VITE_APP_API_URL}/s3/uploadUrl?imageExtension=${imageExtension}&filePath=${filePath}`;

	const res = await axiosClient.get(url);
	const data = res.data;

	return {
		uploadUrl: data.uploadUrl,
		imageUrl: data.imageUrl,
		keyName: data.keyName,
	};
}
