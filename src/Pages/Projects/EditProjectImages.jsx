export default function EditProjectImages({ images, onDelete, onToggleBefore }) {
    if (!images || images.length === 0) return <p>אין תמונות להצגה</p>;
    return (
        <div className="images-gallery">
            <h3>ניהול תמונות</h3>
            <div className="images-grid">
                {images.map(img => (
                    <div key={img.id} className="img-item-wrapper">
                        <div className="edit-img-card">
                            <img src={`http://localhost:3000${img.image_url}`} alt="project" />
                        </div>
                        <div className="img-controls">
                            <button type="button" onClick={() => onDelete(img.id)}>מחק</button>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={img.is_before}
                                    onChange={() => onToggleBefore(img.id, !img.is_before)}
                                />
                                {img.is_before ? " לפני" : " אחרי"}
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}