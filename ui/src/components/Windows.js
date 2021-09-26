import Window from "./Window";
import { useWindows } from "../providers";

export default function Windows() {
  const { windows } = useWindows();

  if(!windows) return null;

  return Object.keys(windows).map(key => {
    const wind = windows[key];
    if(!wind.open) return;

    return (
      <Window id={key} {...wind}>{wind.component && <wind.component />}</Window>
    );
  });
}