const fetchWithDelay = (url: string, delay: number): Promise<Response> =>
  new Promise(resolve => setTimeout(() => resolve(fetch(url, { method: "GET" })), delay));

export interface Quote {
  body: string;
  author: string;
}

export const getQuote = () =>
  fetchWithDelay("https://favqs.com/api/qotd", Math.random() * 3000)
    .then(result => result.json())
    .then<{ quote: Quote }>(result => result.quote);

const arrayBufferToBase64 = buffer => {
  let binary = "";
  const bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
};

export const getPicture = (width: number, height: number) =>
  fetchWithDelay(`https://picsum.photos/${width}/${height}`, Math.random() * 3000).then(res =>
    res.arrayBuffer().then(buffer => "data:image/jpeg;base64," + arrayBufferToBase64(buffer))
  );
