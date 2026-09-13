import { useState, type MouseEvent } from "react";

interface ListGroupProps {
    items: string[];
    heading: string;
    onSelectItem: (item: string) => void;
}

function ListGroup({ items, heading, onSelectItem }: ListGroupProps) {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const handleClick = (item: string, index: number, event: MouseEvent) => {
        setSelectedIndex(index);
        onSelectItem(item);
        console.log(item, index, event);
    };

    return (
        <>
            <h1>{heading}</h1>
            {items.length === 0 && <p>No item found</p>}
            <ul className="list-group">
                {items.map((item, index) => (
                    <li
                        className={
                            index === selectedIndex
                                ? "list-group-item active"
                                : "list-group-item"
                        }
                        key={item}
                        onClick={(event) => handleClick(item, index, event)}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default ListGroup;
