import { useState, useEffect } from "react";
import { ROOM_TYPES, STYLES } from "../../../constants";

export default function ProjectFilters({ setFilters }) {
    const [localSearch, setLocalSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setFilters({ designer_name: localSearch });
        }, 500);
        return () => clearTimeout(handler);
    }, [localSearch]);

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFilters({ [name]: value });
    };

    return (
        <div className="filters-container">
            <h3>סינון פרויקטים</h3>
            <input
                type="text"
                placeholder="חפש לפי שם מעצבת..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
            />

            <select name="room_type" onChange={handleSelectChange}>
                <option value="">כל החדרים</option>
                {ROOM_TYPES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>

            <select name="style" onChange={handleSelectChange}>
                <option value="">כל הסגנונות</option>
                {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
        </div>
    );
}