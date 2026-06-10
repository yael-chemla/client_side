// import { APARTMENT_ROOM_TYPES } from "../../constants";


// export default function EditProjectImages({ images, onDelete, onToggleBefore,  projectRoomType,onRoomTypeChange }) {
//     if (!images || images.length === 0) return <p>אין תמונות להצגה</p>;
//     return (
//         <div className="images-gallery">
//             <h3>ניהול תמונות</h3>
//             <div className="images-grid">
//                 {images.map(img => (
//                     <div key={img.id} className="img-item-wrapper">
//                         <div className="edit-img-card">
//                             <img src={`http://localhost:3000${img.image_url}`} alt="project" />
//                         </div>
//                         <div className="img-controls">
//                             <button type="button" onClick={() => onDelete(img.id)}>מחק</button>
//                             <label>
//                                 <input
//                                     type="checkbox"
//                                     checked={img.is_before}
//                                     onChange={() => onToggleBefore(img.id, !img.is_before)}
//                                 />
//                                 {img.is_before ? " לפני" : " אחרי"}
//                             </label>
//                             {/* ✅ select מופיע רק אם הפרויקט הוא דירה */}
//                             {projectRoomType === "דירה" && (
//                                 <select
//                                     value={img.room_type || ""}
//                                     onChange={(e) => onRoomTypeChange(img.id, e.target.value)}
//                                 >
//                                     <option value="">בחר סוג חדר</option>
//                                     {APARTMENT_ROOM_TYPES.map(r => (
//                                         <option key={r.value} value={r.value}>{r.label}</option>
//                                     ))}
//                                 </select>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
import { APARTMENT_ROOM_TYPES } from "../../constants";

export default function EditProjectImages({ images, onDelete, onToggleBefore, projectRoomType, onRoomTypeChange }) {
    if (!images || images.length === 0) return <p className="no-images-msg">אין תמונות להצגה</p>;

    const beforeImages = images.filter(img => img.is_before);
    const afterImages = images.filter(img => !img.is_before);
    const unclassified = images.filter(img => img.is_before === null || img.is_before === undefined);

    const renderImageCard = (img) => (
        <div key={img.id} className="edit-image-card">
            <div className="edit-image-photo">
                <img src={`http://localhost:3000${img.image_url}`} alt="project" />

                {/* X מחיקה בפינה */}
                <button
                    type="button"
                    className="edit-delete-x"
                    onClick={() => onDelete(img.id)}
                >
                    ✕
                </button>
            </div>

            {/* פוטר מתחת לתמונה */}
            <div className="edit-image-footer">
                {/* צ'קבוקס לפני/אחרי */}
                <label className="edit-before-label">
                    <input
                        type="checkbox"
                        checked={!!img.is_before}
                        onChange={() => onToggleBefore(img.id, !img.is_before)}
                    />
                    {img.is_before ? "אחרי השיפוץ" : "לפני השיפוץ"}
                </label>

                {/* select סוג חדר */}
                {projectRoomType === "דירה" && (
                    <select
                        className="edit-room-select"
                        value={img.room_type || ""}
                        onChange={(e) => onRoomTypeChange(img.id, e.target.value)}
                    >
                        <option value="">🏠 חדר</option>
                        {APARTMENT_ROOM_TYPES.map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </select>
                )}
            </div>
        </div>
    );

    return (
        <div className="edit-images-section">
            <h3 className="edit-images-title">ניהול תמונות</h3>

            {beforeImages.length > 0 && (
                <div className="edit-images-group">
                    <h4 className="edit-group-title">לפני השיפוץ</h4>
                    <div className="edit-images-grid">
                        {beforeImages.map(renderImageCard)}
                    </div>
                </div>
            )}

            {afterImages.length > 0 && (
                <div className="edit-images-group">
                    <h4 className="edit-group-title">אחרי השיפוץ</h4>
                    <div className="edit-images-grid">
                        {afterImages.map(renderImageCard)}
                    </div>
                </div>
            )}

            {unclassified.length > 0 && (
                <div className="edit-images-group">
                    <h4 className="edit-group-title">ללא סיווג</h4>
                    <div className="edit-images-grid">
                        {unclassified.map(renderImageCard)}
                    </div>
                </div>
            )}
        </div>
    );
}