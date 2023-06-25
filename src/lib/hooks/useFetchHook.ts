import { AxiosError } from 'axios';
import React, { useEffect } from 'react';
import { useApiContext } from '../context/ApiContext';
import log from '../util/LoggerUtil';
import { getCachedData, setCachedData } from '../services/CacheService';
import { useNotificationContext } from '../context/NotificationContext';

const useFetchHook = (config: any, auth = false) => {
  const { useFetch } = useApiContext();
  const { dispatcher } = useNotificationContext();

  if (!useFetch) {
    log.error('Unable to find Auth API...');
    throw new Error('Unable to find Auth API...');
  }

  const [data, setData] = React.useState<any>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [onError, setOnError] = React.useState<any | undefined>(undefined);

  useEffect(() => {
    if (onError) {
      dispatcher.addNotification({ type: 'error', message: onError });
    }
  }, [onError]);

  //FIXME: Duplicate throw error, getCache does it anyways
  async function getCache(){
    const cachedData = await getCachedData(config.url);
    if (!cachedData) {
      throw new Error('No cached data found...', config.url);
    }
    return Object.values(cachedData);
  }

  const getFresh = async () => {
    /**
     * Fetch
     */
    let msg = '';
    const data = await useFetch(config, auth).catch((err: AxiosError) => {
      msg = err.request?.response
        ? err.request.response
        : 'Timeout: It took more than 5 seconds to get the result!!';
    });

    if (data) {
      await setCachedData(config.url, { ...data.data });
      return data.data;
    }

    throw new Error(msg);
  };

  const onFetch = async (fn: () => Promise<any>) => {
    /**
     * Fetch
     */
    setOnError(undefined);
    setData(undefined);
    setIsLoading(true);

    const data = await fn()
      .catch((err: any) => setOnError(err.message ? err.message : 'Something went wrong...'))
      .finally(() => setIsLoading(false));

    if (data) {
      setData(data);
      return data;
    }
  };

  const init = async () => {
    /**
     * Fetch
     */
    setOnError(undefined);
    setData(undefined);
    setIsLoading(true);

    const data = await getCache().then((data) => {
      return data;
    })
      .catch(async (err: any) => {
        return await getFresh();
      })
      .catch((err: any) => setOnError(err.message ? err.message : 'Something went wrong...'))
      .finally(() => setIsLoading(false));

    if (data) {
      setData(data);
      return data;
    }
  };

  return {
    data,
    isLoading,
    onError,
    setData,
    onFetch,
    getCache,
    getFresh,
    init,
  };
};

export default useFetchHook;
