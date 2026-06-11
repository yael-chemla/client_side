import { API_BASE_URL } from "../../../constants";

export default function ProjectGallery({ images, projectTitle }) {
    const beforeImages = images?.filter(img => img.is_before);
    const afterImages = images?.filter(img => !img.is_before);

    return (
        <section className="project-gallery">
            {beforeImages.length > 0 && (
                <div className="gallery-section">
                    <h2 className="gallery-section-title">לפני השיפוץ</h2>
                    <div className="images-row">
                        {beforeImages.map(img => (
                            <div key={img.id} className="image-wrapper">
                                <img
                                    src={`${API_BASE_URL}${img.image_url}`}
                                    alt={img.room_type || projectTitle}
                                />
                                {img.room_type && (
                                    <span className="image-room-label">{img.room_type}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {afterImages.length > 0 && (
                <div className="gallery-section">
                    <h2 className="gallery-section-title">אחרי השיפוץ</h2>
                    <div className="images-row">
                        {afterImages.map(img => (
                            <div key={img.id} className="image-wrapper">
                                <img
                                    src={`${API_BASE_URL}${img.image_url}`}
                                    alt={img.room_type || projectTitle}
                                />
                                {img.room_type && (
                                    <span className="image-room-label">{img.room_type}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}