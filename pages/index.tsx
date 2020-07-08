import Layout from '../components/Layout';
import { createWorker } from 'tesseract.js';
import { ChangeEvent, useState } from 'react';
import { ImageWithRect } from '../components/ImageWithRect';

const IndexPage = () => {
  const [fileSrc, setFileSrc] = useState<string | undefined>(undefined);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  function click() {
    if (fileSrc) {
      setLoading(true);
      const worker = createWorker();

      (async () => {
        await worker.load();
        await worker.loadLanguage('pol');
        await worker.initialize('pol');
        const result = await worker.recognize(fileSrc);
        console.log(result);
        setText(result.data.text);
        await worker.terminate();
        setLoading(false);
      })();
    }
  }

  function onFileSelect(event: ChangeEvent<HTMLInputElement>) {
    //console.log(event);
    if (event.target?.files?.[0]) {
      setFileSrc(URL.createObjectURL(event.target.files[0]));
    }
  }

  return (
    <Layout title="o-stat">
      <div>
        <p>obraz</p>
        <input type="file" onChange={onFileSelect}></input>
        <ImageWithRect fileSrc={fileSrc} />
      </div>
      <div>
        <p>wynik</p>

        {loading ? (
          <div>czekaj...</div>
        ) : (
          <>
            <button className="btn" onClick={click}>
              tekst
            </button>
            <div>{text}</div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default IndexPage;
