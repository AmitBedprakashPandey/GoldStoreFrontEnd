import background from "../Assets/images/background.jpg";
export default function InfoCard(params) {
    return(
        <div className="bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
        >InfoCard</div>
    )
}