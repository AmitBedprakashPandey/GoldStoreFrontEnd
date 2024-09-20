import { BreadCrumb } from "primereact/breadcrumb";
import { PiHouse } from "react-icons/pi";
export default function WebsiteSetting(params) {
    const home = {
        icon: <PiHouse size={20} className="mr-2" />,
        label: " Home",
        url: "/crm",
      };

      const item =[{label:'Website Setting'}]

    return(<>
    <div>
        <BreadCrumb home={home}  model={item}/>
    </div>
    <div className="p-2">
    <div>
        <button className="bg-blue-600 px-8 py-3 font-semibold text-white rounded-md hover:bg-blue-700 duration-200 shadow-md hover:shadow-blue-400" >Catagory</button>
    </div>
    </div>
    </>)
}