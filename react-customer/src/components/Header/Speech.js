import MicOffIcon from '@mui/icons-material/MicOff';
import { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { BounceLoader } from 'react-spinners';
import './speech.css';
let countRender = 0;
let countSetTextSearch = 0;

export default function Speech(props) {
  countRender++;
  const {
    transcript,
    finalTranscript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();
  console.log('listening', listening, countRender);
  let timeOutID;

  useEffect(() => {
    console.log('vào useEffect', props);
    // start listening, khi start render lại 2 lần, lần thứ 2 ms chính thức đặt listening thành true
    SpeechRecognition.startListening();

    // eslint-disable-next-line
    timeOutID = setTimeout(() => {
      console.log('bắt đầu settimeout');
      SpeechRecognition.stopListening();
    }, 6000);

    return () => {
      console.log('vào useEffect return');
      countRender = 0;
      countSetTextSearch = 0;
      SpeechRecognition.abortListening();
      clearTimeout(timeOutID);
      document.getElementsByTagName('body')[0].classList.remove('prevent-scroll-body');
    }
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <span>Trình duyệt đang sử dụng hiện không hõ trợ nhận diện giọng nói!</span>;
  }

  // change text search when listening off
  if (!listening && countRender > 3 && countSetTextSearch === 0 && isMicrophoneAvailable) {
    countSetTextSearch++;
    let textSearch = transcript.charAt(0).toUpperCase() + transcript.slice(1);
    console.log('vào setTextSearch nè', listening, transcript, finalTranscript);
    props.setTextSearch(textSearch);
  }

  return (
    <div className="speech-area">
      <div className="speech-area__micro">
        {
          isMicrophoneAvailable && listening ?
            (
              <>
                <i className="fa-solid fa-microphone"></i>
                <BounceLoader
                  color="grey"
                  size={70}
                /></>
            )
            :
            (
              <MicOffIcon></MicOffIcon>
            )
        }
      </div>

      <div className="speech-area__micro-detail">
        {
          !isMicrophoneAvailable ?
            (
              <div>
                Quyền truy cập micro chưa được cấp.<br />
                Bạn cần cấp quyền truy cập trong cài đặt của trình duyệt và có thể cần tải lại trang này để cài đặt mới có hiệu lực.
              </div>
            )
            :
            (
              <div>
                Micro đang {listening ? 'bật' : 'tắt'}.
                <br />
                Bạn hãy nói từ khóa cần tìm kiếm.
                <br />
                <span>{transcript.charAt(0).toUpperCase() + transcript.slice(1)}</span>
              </div>
            )
        }
      </div>

      <div className="speech-area__text-result"></div>
    </div>
  )
}