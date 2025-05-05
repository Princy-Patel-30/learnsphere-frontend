import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useInstructor } from '../Context/InstructorContext';
import SessionForm from './SessionForm';
import RichTextEditor from './RichTextEditor';

const CreateCourse = () => {
  const { submitCourse } = useInstructor();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '<p></p>',
      category: '',
      sessions: [
        { title: '', videoUrl: '', content: '<p></p>' }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sessions',
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        sessions: data.sessions.map(s => ({
          title: s.title,
          youtubeLink: s.videoUrl,
          explanation: s.content,
        })),
      };

      await submitCourse(payload);
      toast.success('Course created successfully!');
      navigate('/instructordashboard');
    } catch (err) {
      console.error('Course creation error:', err);
      toast.error(err.response?.data?.message || 'Course creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['AI', 'Web', 'Machine Learning & AI', 'English'];

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Create New Course
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Title
          </label>
          <input
            {...register('title', { required: 'Course title is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course title"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <RichTextEditor
            name="description"
            control={control}
            placeholder="Write a detailed course description..."
            rules={{ required: 'Description is required' }}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        {/* Sessions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sessions
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-4">
              <SessionForm
                index={index}
                control={control}
                register={register}
                errors={errors}
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Remove Session
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ title: '', videoUrl: '', content: '<p></p>' })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Session
          </button>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg text-white ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;