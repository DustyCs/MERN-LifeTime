import { WeekSchedule, HealthCharts, AISuggestions, HobbyChill, PopupOverlay }  from "../components/home-sections/sections";

export default function Home() {
  return (
    <div className="flex ">
      <div className="flex-1 p-4">
        <header className="text-black text-3xl font-bold mb-4">Organize Your Life</header>
        <WeekSchedule />
        <HealthCharts />
        <AISuggestions />
        <HobbyChill />
      </div>
      {/* <PopupOverlay /> */}
    </div>
  );
}
