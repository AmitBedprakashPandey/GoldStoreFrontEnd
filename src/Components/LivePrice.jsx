import { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import {
  PiPlusBold,
  PiListBold,
  PiCloudArrowUpDuotone,
  PiTrashDuotone,
} from "react-icons/pi";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import { motion } from "framer-motion";
import { createLivePrice, livePriceAll } from "../Store/Slice/LivePriceSlice";
import { useDispatch, useSelector } from "react-redux";

export default function LivePrice(params) {
  const dispatch = useDispatch();
  const [publicPrice, setPublicPrice] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [formData, setFormData] = useState({
    material: "Gold",
    price: 0,
    carat: null,
    prefix: "g",
    weight: 0,
  });
  const material = [{ name: "Gold" }, { name: "Silver" }];
  const [goldCaret, setGoldCaret] = useState([]);

  const { livePrice, loading, error, message } = useSelector(
    (state) => state.LivePrice
  );
  useEffect(() => {
    dispatch(livePriceAll());
    const caretList = [];
    for (let index = 0; index < 24; index++) {
      caretList.push({ name: index + 1 + " Carat" });
    }
    setGoldCaret(caretList);
  }, []);

  useEffect(() => {
    dispatch(livePriceAll());
  }, [livePrice]);

  const formDataHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addPriceListHandler = () => {
    setPublicPrice((prevList) => [...prevList, formData]);
    setFormData({
      ...formData,
      material: "Gold",
      price: 0,
      carat: null,
      prefix: "g",
      weight: 0,
    });
  };

  const priceListBodyTemplate = (rowData) => {
    return (
      <div>
        {rowData.price.map((item, index) => (
          <div key={index}>
            {item.material} {item.carat} - {item.weight} {item.prefix}: ₹
            {item.price}
          </div>
        ))}
      </div>
    );
  };

  const LiveStatusBodyTemplate = (rowData) => {
    return (
      <Badge
        value={"Live"}
        severity={rowData.status === true ? "success" : "danger"}
      />
    );
  };

  const publicHandler = () => {
    const updatedPriceList = {
      date: moment().format("DD/MM/YYYY"),
      price: publicPrice,
      status: true,
      companyId: "66c81d6541ef1fc1211c1e63",
    };

    dispatch(createLivePrice(updatedPriceList)).then(() => setPublicPrice([]));
  };

  const deleteHandler = (index) => {
    const indexToRemove = publicPrice.filter((item) => item !== index);
    setPublicPrice(indexToRemove);
  };
  return (
    <div className="px-10 pt-5">
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        maximized={true}
      >
        <div className="mt-10">
          <DataTable value={livePrice} className="">
            <Column
              header={"#"}
              body={(rowData, { rowIndex }) => rowIndex + 1}
            />
            <Column header={"Date"} field="date" />
            <Column header={"Price"} body={priceListBodyTemplate} />
            <Column
              header={"Status"}
              field="status"
              body={LiveStatusBodyTemplate}
            />
          </DataTable>
        </div>
      </Dialog>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button
            icon={<PiListBold />}
            onClick={() => setVisible(true)}
            className="border-2 h-10"
          />
          <h1 className="text-nowrap text-md font-bold flex items-center gap-2">
            Live Price{" "}
            <p className="text-red-500 text-base">
              ({moment(Date()).format("DD/MM/YYYY")})
            </p>
          </h1>
        </div>
        <div>
          <Button
            label="Public"
            disabled={publicPrice.length === 0}
            icon={<PiCloudArrowUpDuotone />}
            onClick={publicHandler}
            className="gap-3 font-normal px-5 py-1.5 flex justify-center text-white bg-blue-700 hover:bg-blue-800 duration-300"
          />
        </div>
      </div>
      <div className="grid my-3">
        <label htmlFor="material" className="text-slate-400 font-medium">
          Select Material{" "}
        </label>
        <Dropdown
          id="material"
          defaultChecked
          defaultValue={material[0].name}
          value={formData.material}
          name="material"
          onChange={formDataHandler}
          options={material}
          optionLabel="name"
          optionValue="name"
          placeholder="Select Material"
          className="border placeholder:text-slate-200"
        />
      </div>
      {formData.material === "Gold" && (
        <div className="grid my-3">
          <label htmlFor="carat" className="text-slate-400 font-medium">
            Select Carat{" "}
          </label>
          <Dropdown
            id="carat"
            value={formData.carat}
            name="carat"
            onChange={formDataHandler}
            options={goldCaret}
            optionLabel="name"
            optionValue="name"
            placeholder="Select Carat"
            className="border placeholder:text-slate-200"
          />
        </div>
      )}
      <div className="flex items-center gap-10">
        <div className="flex items-center">
          <RadioButton
            inputId="ingredient1"
            name="prefix"
            value="kg"
            onChange={formDataHandler}
            checked={formData.prefix === "kg"}
            className="border-2 w-6 h-6 rounded-full"
          />
          <label htmlFor="ingredient1" className="ml-2">
            Kg
          </label>
        </div>
        <div className="flex items-center">
          <RadioButton
            inputId="ingredient2"
            name="prefix"
            value="g"
            onChange={formDataHandler}
            checked={formData.prefix === "g"}
            className="border-2 w-6 h-6 rounded-full"
          />
          <label htmlFor="ingredient2" className="ml-2">
            Grams
          </label>
        </div>
      </div>

      <div className="grid my-3">
        <label
          htmlFor="weight"
          className="flex gap-2 text-slate-400 font-medium"
        >
          Enter <p className="uppercase">({formData.prefix})</p>
        </label>
        <InputNumber
          id="weight"
          suffix={formData.prefix === "kg" ? "kg" : "g"}
          value={Number(formData.weight)}
          name="weight"
          onChange={(e) => setFormData({ ...formData, weight: e.value })}
          placeholder="Enter Weight"
          inputClassName="pl-3"
          className="border h-12 rounded-md"
        />
      </div>

      <div className="grid my-3">
        <label htmlFor="material" className="text-slate-400 font-medium">
          Enter Amount
        </label>
        <InputNumber
          id="price"
          value={formData.price}
          suffix="₹"
          name="price"
          onChange={(e) => setFormData({ ...formData, price: e.value })}
          placeholder="Enter Price"
          inputClassName="pl-3"
          className="border h-12 rounded-md"
        />
      </div>

      <div className="w-full flex justify-center">
        <Button
          icon={<PiPlusBold size={20} />}
          label="Add"
          disabled={
            formData.material &&
            formData.prefix &&
            formData.price &&
            formData.weight
              ? false
              : true
          }
          onClick={addPriceListHandler}
          className="gap-3 py-4 px-40 flex justify-center uppercase text-white bg-blue-700 hover:bg-blue-800 duration-300"
        />
      </div>

      <div className="mt-5 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12">
        {publicPrice?.map((item, index) => (
          <GoldItems data={item} key={index} dele={() => deleteHandler(item)} />
        ))}
      </div>

      <div className="relative w-full">
        <div className="fixed bottom-0 left-0 right-0 w-full ">
          <div className="flex justify-center w-full">
            {message && 
            <motion.div
            initial={{ bottom: 0,opacity:1 }}
            animate={{ bottom: 50 ,opacity:0}}
            transition={{
              duration: 0.5,
              opacity: { delay: 3, duration: 0.5 },
            }}
              className="bg-black w-56 h-12 rounded-full absolute bottom-0 flex justify-center items-center"
            >
              <strong className="text-white uppercase">Save</strong>
            </motion.div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

const GoldItems = ({ data, dele }) => {
  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ease: "easeInOut", duration: 0.5 }}
        className={`${
          data?.material === "Gold" ? "bg-yellow-300" : "bg-gray-300"
        } relative m-3 text-black capitalize rounded-full w-32 h-16 flex justify-center flex-col items-center`}
      >
        <p className="text-xs">
          {data?.material} {data?.carat} {data?.weight}
          {data?.prefix}
        </p>
        <strong> ₹ {data?.price}/-</strong>
        <Button
          onClick={() => dele()}
          icon={<PiTrashDuotone color="#fff" />}
          className="absolute -top-2.5 right-0 bg-red-500 w-5 "
        />
      </motion.div>
    </>
  );
};

const LiveStatus = ({}) => {
  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, ease: "easeInOut", duration: 0.5 }}
        className="relative text-gray-300 hover:bg-gray-300 hover:text-black transition-colors duration-300 capitalize eczar-font border-2 border-gray-300 rounded-full w-36 h-16 flex justify-center flex-col items-center"
      >
        <p className="text-xs">Gold 22 Carat 1g</p>
        <strong> ₹ 7187 /-</strong>
      </motion.div>
    </>
  );
};
