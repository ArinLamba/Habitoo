import { useAudio } from "react-use";

export const useCompletionSound = () => {
  const [audio, , controls] = useAudio({
    src: "/completed.mp3",
  });

  const play = () => {
    controls.seek(0);
    controls.play();
  };

  return { audio, play };
};