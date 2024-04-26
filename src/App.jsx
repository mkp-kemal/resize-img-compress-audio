import './app.css'
import AudioProcessor from './components/AudioProcessor'
import ResizeImage from './components/ResizeImage'
// import ResizeImage from './ResizeImage'


function App() {

  return (
    <div className="App">
      <div style={{marginBottom: '20px'}}>
        <AudioProcessor />
      </div>
      <ResizeImage />
    </div>
  )
}

export default App
