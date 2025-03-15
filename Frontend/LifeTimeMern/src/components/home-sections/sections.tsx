export function WeekSchedule() {
    return (
      <div className="w-full text-center mt-8">
        <h1 className="text-red-600 text-2xl font-bold">Current Week</h1>
        <div className="week-schedule border border-gray-300 p-4 mt-4"></div>
      </div>
    );
  }
  
  export function HealthCharts() {
    return (
      <div className="w-full text-center mt-8">
        <h1 className="text-red-600 text-2xl font-bold">Health Status</h1>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <canvas id="firstChart" className="max-w-[500px]"></canvas>
          <canvas id="secondChart" className="max-w-[500px]"></canvas>
        </div>
      </div>
    );
  }
  
  export function AISuggestions() {
    return (
      <div className="w-full text-center mt-8">
        <h1 className="text-red-600 text-2xl font-bold">AI Suggestion</h1>
        <div className="flex flex-col items-center mt-4">
          <input 
            type="text" 
            id="ai-prompt" 
            placeholder="Ask Gemini AI a question..." 
            className="border p-2 w-80 rounded-md shadow-sm"
          />
          <button 
            id="ai-submit" 
            className="bg-red-600 text-white px-4 py-2 mt-2 rounded-md"
          >
            Ask Gemini
          </button>
        </div>
        <div className="ai-suggestion mt-4"></div>
      </div>
    );
  }
  
  export function HobbyChill() {
    return (
      <div className="w-full text-center mt-8">
        <div className="mb-4">
          <h1 className="text-red-600 text-2xl font-bold">Hobby</h1>
          <p>Based on your current health status, we suggest you take a walk for 30 minutes.</p>
        </div>
        <div>
          <h1 className="text-red-600 text-2xl font-bold">Chill Out</h1>
          <p>Based on your current health status, we suggest you take a walk for 30 minutes.</p>
        </div>
      </div>
    );
  }
  
  export function PopupOverlay() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-md shadow-lg w-96 text-center relative">
          <button className="absolute top-2 right-2 text-lg font-bold">x</button>
          <p className="text-2xl font-bold">LifeTime</p>
          <h2 className="text-xl mt-2 font-semibold">We would like to know more about you</h2>
          <p className="mt-2 text-gray-600">Click the button below to get started</p>
          <a href="views/interviewer.html" className="bg-red-600 text-white px-4 py-2 mt-4 inline-block rounded-md">
            Get Started
          </a>
        </div>
      </div>
    );
  }
  