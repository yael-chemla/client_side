export default function ProjectDescription({ description, isOwner, isAuthenticated, onChat }) {
    return (
        <article className="project-description">
            <h3>על הפרויקט</h3>
            <p>{description}</p>
            {!isOwner && (
                <div className="chat-container">
                    <button className="chat-btn" onClick={onChat}>
                        {isAuthenticated ? "צ'אט עם המעצבת" : "התחבר כדי לשוחח עם המעצבת"}
                    </button>
                </div>
            )}
        </article>
    );
}