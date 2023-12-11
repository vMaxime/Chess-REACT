
function Piece({ type, team, children }) {
    return (
        <div className={'piece ' + type.toLowerCase() + ' ' + team}>
            {
                <img src={`/${type.toLowerCase()}_${team}.png`} />
            }
        </div>
    );
}

export default Piece;