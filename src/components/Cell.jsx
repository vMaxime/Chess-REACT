function Cell(props) {
    const index = props.index;
    const rowOfCell = Math.floor(index / 8);
    const cellType =  rowOfCell % 2 ? (index % 2 ? 'white' : 'black') : (index % 2 ? 'black' : 'white');
    return (
        <div className={'cell ' + cellType}>
            {props.children ? props.children : null}
        </div>
    );
}

export default Cell;