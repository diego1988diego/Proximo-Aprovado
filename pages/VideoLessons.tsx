
import React, { useState } from 'react';
import { db } from '../db';
import { PlayCircle, Video } from 'lucide-react';

const VideoLessons: React.FC = () => {
  const [videos] = useState(db.getVideos());
  const [activeVideo, setActiveVideo] = useState(videos[0]);
  const [filterDiscipline, setFilterDiscipline] = useState('');

  const filteredVideos = filterDiscipline 
    ? videos.filter(v => v.disciplina === filterDiscipline)
    : videos;

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        {/* Player */}
        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group">
          <video 
            src={activeVideo.url} 
            controls 
            className="w-full h-full"
            poster={activeVideo.thumb}
          ></video>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{activeVideo.titulo}</h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-bold rounded-full">{activeVideo.disciplina}</span>
        </div>
      </div>

      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2 dark:text-white">
            <Video size={18} /> Filtro por matéria
          </h3>
          <select 
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={filterDiscipline}
            onChange={e => setFilterDiscipline(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="Direito Penal">Direito Penal</option>
            <option value="Português">Português</option>
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 overflow-y-auto max-h-[600px] space-y-4">
          <h3 className="font-bold border-b pb-2 dark:text-white">Playlist</h3>
          {filteredVideos.map(v => (
            <button 
              key={v.id}
              onClick={() => setActiveVideo(v)}
              className={`flex gap-3 w-full text-left p-2 rounded-lg transition-colors ${
                activeVideo.id === v.id ? 'bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 relative">
                <img src={v.thumb} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <PlayCircle size={20} className="text-white" />
                </div>
              </div>
              <div className="flex flex-col justify-between py-1">
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2">{v.titulo}</span>
                <span className="text-xs text-blue-600 font-medium">{v.disciplina}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoLessons;
