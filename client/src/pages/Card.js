import { useParams } from "react-router-dom"

function Card() {
    const params = useParams()

    return(
        <div>
            Cards
            <p> The card is {params.cid}</p>
        </div>
    )
}

export default Card