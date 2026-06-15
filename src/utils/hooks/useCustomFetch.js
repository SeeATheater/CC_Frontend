import { useState, useEffect, useCallback } from 'react';
import useAxios from './useAxios';

const useCustomFetch = (url, method = 'GET', body = null) => {
	const axiosClient = useAxios();

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const fetchData = useCallback(
		async (
			customUrl = url,
			customMethod = method,
			customBody = body,
		) => {
			if (!customUrl) return;
			setLoading(true);
			setError(false);

			try {
				const response = await axiosClient({
					method: customMethod,
					url: customUrl,
					data: customBody,
				});
				setData(response.data);
				return response;
			} catch (err) {
				setError(true);
				return { isSuccess: false, message: 'API 요청 실패', error: err };
			} finally {
				setLoading(false);
			}
		},
		[axiosClient, body, method, url],
	);

	useEffect(() => {
		if (url && method === 'GET') {
			fetchData();
		}
	}, [fetchData, method, url]);

	return { data, loading, error, fetchData };
};

export default useCustomFetch;
