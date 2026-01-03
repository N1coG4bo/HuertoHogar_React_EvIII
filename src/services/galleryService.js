import api from './api';

export const galleryService = {
  list() {
    return api.get('/uploads/gallery');
  },
  upload(file) {
    const form = new FormData();
    form.append('image', file);
    return api.post('/uploads/gallery', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
