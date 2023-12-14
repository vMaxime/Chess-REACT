function Piece({ type, team }) {
    const teamStr = team ? 'white' : 'black';
    return (
        <div className={'piece ' + type.toLowerCase() + ' ' + teamStr} >
            {
                <img src={`/${type.toLowerCase()}_${teamStr}.png`} draggable={false} />
            }
        </div>
    );
}

export default Piece;