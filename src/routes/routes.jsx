import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AudioProcessor from "../components/AudioProcessor";
import ResizeImage from "../components/ResizeImage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    },
    {
        path: "/resize",
        element: <ResizeImage />
    },
    {
        path: "/compress",
        element: <AudioProcessor />
    }
]);

export default router;