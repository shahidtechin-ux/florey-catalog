// models/Catalogue.js
import mongoose from 'mongoose';

const CatalogueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  edition: { type: String, required: true },
  pdfUrl: { type: String },
  coverImage: { type: String }
}, { timestamps: true });

export default mongoose.models.Catalogue || mongoose.model('Catalogue', CatalogueSchema);