import { readable } from 'svelte/store';
let maxValue: number;

function getLatestFilename(url: string): string | null {
  const reqHeaders = new Headers();
  const init: Object = {
    method: 'GET',
    headers: reqHeaders,
    mode: 'no-cors',
    cache: 'force-cache',
  };
  const webReq: Request = new Request(url, init);

    const result = fetch(webReq)
        .then((response: Response) => response.text())
        .catch(() => null);
  return result;
}
