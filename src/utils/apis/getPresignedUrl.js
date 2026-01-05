export async function getPresignedUrl(axiosClient, extensions, filePath) {
	const url = `${import.meta.env.VITE_APP_API_URL}/s3/uploadUrls?filePath=${filePath}`;

	const res = await axiosClient.post(url, extensions, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return res.data;
}
