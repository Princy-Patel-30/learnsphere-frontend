import React from 'react';
import { useWatch } from 'react-hook-form';
import RichTextEditor from './RichTextEditor';

const SessionForm = ({ index, control, register, errors }) => {
  // optional: you can watch content if you need it
  const contentValue = useWatch({
    control,
    name: `sessions[${index}].content`,
  });

  return (
    <div className="border border-gray-200 p-4 mb-4 rounded-lg">
      {/* Session Title */}
      <input
        {...register(`sessions[${index}].title`, {
          required: 'Session title is required',
        })}
        placeholder="Session Title"
        className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.sessions?.[index]?.title && (
        <p className="text-red-500 text-sm">
          {errors.sessions[index].title.message}
        </p>
      )}

      {/* YouTube URL */}
      <input
        {...register(`sessions[${index}].videoUrl`, {
          required: 'Video URL is required',
        })}
        placeholder="YouTube Video URL"
        className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.sessions?.[index]?.videoUrl && (
        <p className="text-red-500 text-sm">
          {errors.sessions[index].videoUrl.message}
        </p>
      )}

      {/* Session Content */}
      <RichTextEditor
        name={`sessions[${index}].content`}
        control={control}
        placeholder="Write session content…"
        rules={{ required: 'Session content is required' }}
      />
      {errors.sessions?.[index]?.content && (
        <p className="text-red-500 text-sm">
          {errors.sessions[index].content.message}
        </p>
      )}
    </div>
  );
};

export default SessionForm;
