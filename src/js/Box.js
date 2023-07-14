import { useState } from 'react';

export default function Box({ id }) {
    
    const [value, setValue] = useState(null);

    function handleClick() {
        setValue('X');
    }

    return (
        <div className="box box_hover" id={"box-" + id} onClick={handleClick}>{value}</div>
    );
}
