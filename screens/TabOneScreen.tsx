import {
  StyleSheet,
  Button,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from "react-native";
import React, { FC, useState, useEffect, ReactElement } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
// import Overlay from "react-native-modal-overlay";
import { View, Text } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import Colors from "../constants/Colors";
import Dropdown from "./TabTwoScreen";
import { wrap } from "module";
// import React, { FC, useState } from 'react';
// import { StyleSheet, Text, TouchableOpacity } from 'react-native';
// import { View } from '../components/Themed';
export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not yet scanned");
  // usestate for current budget
  const [budget, setBudget] = useState(10);
  // current total is added up price of all items in cart
  const [currentTotal, setCurrentTotal] = useState(0);
  // storage for scanned item information
  const [scannedItemStorage, setScannedItemStorage] = useState({});
  // list of user saved items pulled from scan api call
  const [productList, setProductList] = useState([
    {
      barcode: "766218109223",
      description:
        "Whether you are starting a DIY project, creating unique gifts or upcycling various odds and ends this highly-pigmented Americana Acrylic Color is ideal for decorative painting, home decor and general craft projects. The vibrant, rich acrylic color blends easily with others in the Americana line, producing smooth, creamy colors that dry to a durable matte finish. Transform a variety of surfaces including wood, canvas, plaster, resins, papier mache, candles, walls, fabric, leather, Styrofoam, ceramic bisque, polymer clay, paper, poster board, metal and more.",
      image: "https://images.barcodelookup.com/9614/96144763-1.jpg",
      price: "9.99",
      title: "DecoArt Americana Acrylic Color, 16 Oz., Slate Gray",
    },
    {
      barcode: "766218109225",
      description:
        "Whether you are starting a DIY project, creating unique gifts or upcycling various odds and ends this highly-pigmented Americana Acrylic Color is ideal for decorative painting, home decor and general craft projects. The vibrant, rich acrylic color blends easily with others in the Americana line, producing smooth, creamy colors that dry to a durable matte finish. Transform a variety of surfaces including wood, canvas, plaster, resins, papier mache, candles, walls, fabric, leather, Styrofoam, ceramic bisque, polymer clay, paper, poster board, metal and more.",
      image: "https://images.barcodelookup.com/9614/96144763-1.jpg",
      price: "9.99",
      title: "DecoArt Americana Acrylic Color, 16 Oz., Bright White",
    },
  ]);
  const [budgetCardIconColor, setBudgetCardIconColor] = useState('#00ff00')
  // overlay visibility for productlist and bduget
  const [visible, setVisible] = useState(false);
  // urls for api call
  const baseUrl = "https://api.barcodelookup.com/v3/products?barcode=";
  const apiKey = "&formatted=y&key=krrps3snh5q72np1iektbej3l34vmb";

  // example fetch for barcode lookup
  // https://api.barcodelookup.com/v3/products?barcode=9780140157376&formatted=y&key=krrps3snh5q72np1iektbej3l34vmb

  // formula for setting current total state by mapping through items in productlist and adding their price
  const getCurrentTotalFromProductList = () => {
    // variable holding added price as productlist is looped over
    let totalPlaceholder = 0;
    // looping over productlist array and adding each items price to the placeholder value
    for (let i = 0; i < productList.length; i++) {
      // value is a string, as each item is looped over changed price from str into integer with decimals(parsefloat)
      totalPlaceholder += parseFloat(productList[i].price);
    }
    // update current total state with value of totalPlaceholder
    // console.log(totalPlaceholder)
    setCurrentTotal(totalPlaceholder);
  };
  //function for returning text in topcard that compares current total to budget and returns over/under by x amount message
  const currentTotalBudgetComparisonMessage = () =>{
    if(currentTotal>budget){
      setBudgetCardIconColor('#ff0000')
      return(
        `$${currentTotal - budget} over budget`
        )
      }else if(currentTotal<budget){
        setBudgetCardIconColor('#00ff00')
        return(
          `$${budget - currentTotal} under budget`
        )
      }
      console.log("get current total")
    }
  

  // setting up permissions
  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status == "granted");
    })();
  };

  //fetch from barcode lookup to be called when item barcode is scanned. This formula saves that information in state to be added to list of products or ignored
  const getInfoFromBarCode = (barcode) => {
    // barcode and api call are correct on print
    // console.log(baseUrl + barcode.toString() + apiKey)
    fetch(baseUrl + barcode.toString() + apiKey)
      // api call is formated in object{product(Array)[0].key/value}
      .then((res) => res.json())
      // correct data call\\/\/\/
      // .then(data=>{console.log(data.products[0].images[0])})
      .then((data) => {
        // declare placeholder for information from data that we want to isolate
        let newValueToBeStored = {};
        // set new value
        newValueToBeStored = {
          title: data.products[0].title,
          description: data.products[0].description,
          image: data.products[0].images[0],
          barcode: data.products[0].barcode_number,
          price: data.products[0].stores[0].price,
        };
        // console.log(newValueToBeStored)
        // store api request data in state for customer review
        setScannedItemStorage(newValueToBeStored);
        // const productListCopy = [...productList];
        // productListCopy.push();
      })
      // .then(() => console.log(scannedItemStorage))
      .catch((err) => console.log(err));
  };
  // console.log(scannedItemStorage);
  // Add scannedItemStorage data to productList -> called when button "add to cart" in popup when item is scanned is pressed
  const addScannedItemStorageToProductList = () => {
    // copy current productlist contents as variable
    let productListCopy = [...productList];
    // add scanned item info from scannedItemStorage to product list copy
    productListCopy.push(scannedItemStorage);
    // set product list state as updated list
    setProductList(productListCopy);
    // set current total with new item added 
    getCurrentTotalFromProductList()
    // alert that item has been added
    alert("Item added to cart!");
    // remove popup so use can continue scanning new items
    setScanned(false);
  };

  // request camera permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // for tutorial screens we could refactor and duplicate the nav feature at the bottom of the app with links to each other and then a skip that sends to scan page and an endpoint next button that also sends ot scan page.

  // need component for top bar that displays budget in colored card, current total of items in cart, and comparison amount of where current is to budget ($15 under budget)
  // this component has dropdown for detail view, could refactor modal screen to serve this purpose with a prop, or avoid dealing with transfering state at the moment and build everything on this screen

  // ***need to add pop up when scanned that displays scanned item storage info and will hold the scan again button and the add to cart button
  // pop up shows preview of item with 'added to total', a preview total button(link to dropdown list), and a dismiss button(back to scanning)
  // ***popup should have option for adding specific amount of same item to productlist. Coulkd be done with a new key/value that gets adjusted based on the popup and then at the checkout itll factor price X amount of that object?
  // what happens when we scan bar code
  function handleBarCodeScanned({ type, data }) {
    setScanned(true);
    setText(data);
    getInfoFromBarCode(data);
    console.log("Type: " + type + "\nData: " + data);
  }

  // check permission and return the screeens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button
          title={"Allow Camera"}
          onPress={() => askForCameraPermission()}
        ></Button>
      </View>
    );
  }
  // teset data to be mapped over for

  // example code for dropdown picker
  // \/\/\/\/\/\/\/\/
  interface Props {
    label: string;
  }
  const Dropdown: FC<Props> = ({ label }) => {
    const [visible, setVisible] = useState(false);

    const toggleDropdown = () => {
      setVisible(!visible);
    };
    // what is rendered when topcard with budget info is pressed -> maps over productlist and returns small cards
    const renderDropdown = () => {
      if (visible) {
        return (
          <View style={styles.dropdown}>
            {/* <Text>{productList[0].title}</Text> */}
            {productList.map((item) => {
              // console.log(item.title);
              return (
                // <View key={item.barcode} style={styles.dropdownItem}>
                <View
                  style={{
                    backgroundColor: "#fff",
                    width: 400,
                    justifyContent: "center",
                    alignContent: "center",
                    flexGrow: 1,
                    flex: 1,
                    flexDirection: "row",
                    padding: 6,
                  }}
                  key={item.barcode}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 50, height: 50 }}
                  />
                  <Text
                    style={{
                      color: "#000",
                      flexShrink: 6,
                      margin: 6,
                      width: 230,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Button title="+" onPress={() => console.log("plus")} />
                  <Button title="-" onPress={() => console.log("minus")} />
                </View>
                // </View>
              );
            })}
          </View>
        );
      }
    };
    // console.log(productList[0].image);
    return (
      // this is the top card with dropdown feature on press,
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#ffff",

          height: 80,
          width: "90%",
          paddingHorizontal: 10,
          zIndex: 2,
          borderRadius: 25,
        }}
        onPress={toggleDropdown}
      >
        {/* view holding items inside of the topcard */}
        <View
          style={{
            backgroundColor: "#fff",
            // top: 5,
            zIndex: 2,
            flexWrap: "wrap",
            flexDirection: "row",
            margin: 2,
          }}
        >
          {/* topcard colored budget indicator icon */}
          <View
            style={{
              // borderBottomColor: '#fff',
              // zIndex: 8,
              borderRadius: 20,
              height: 60,
              width: 60,
              backgroundColor: budgetCardIconColor,
              // margin: 0,
              justifyContent: "center",
              // alignContent: "center",
              alignItems: "center",
            }}
          >
            {/* budget state inside of red box */}
            <Text style={{ fontSize: 20, fontWeight: "600", color: "#000" }}>${budget}</Text>
          </View>
          {/* text and information view for current total and comparison to budget */}
          <View
            style={{
              backgroundColor: "#ff0000",
              marginLeft: 30,
              flex: 1,
              flexDirection: "column",
            }}
          >
            <Text>Current total: ${currentTotal}</Text>
            {/* function for displaying over/under budget by x amount. Takes currenttotal minus budget and returns text with amount */}
            <Text>{currentTotalBudgetComparisonMessage()}</Text>
          </View>
          {/* calling function for displaying items in productlist as a dropdown */}
          {renderDropdown()}
        </View>

        <Text style={styles.buttonText}></Text>
        {/* <Icon type='font-awesome' name='chevron-down'/> */}
      </TouchableOpacity>
    );
  };

  // return the updated view after scan
  return (
    <View style={styles.container}>
      <Dropdown label={`ProductList`} />
      {/* <Dropdown label="Productlist" /> */}

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }}
        />
      </View>
      <Text style={styles.mainText}>{text}</Text>

      {scanned && (
        <View>
          <Button
            title={"Scan Again?"}
            onPress={() => setScanned(false)}
            color="tomato"
          />
          <Button
            title={"Add to Cart"}
            onPress={() => addScannedItemStorageToProductList()}
          />
        </View>
      )}
      {/* <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "tomato",
    position: "relative",
    zIndex: 1,
  },
  mainText: {
    fontSize: 60,
    margin: 20,
  },
  topCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 300,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "tomato",
  },
  budgetColorDisplay: {
    backgroundColor: "green",
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffff",

    height: 80,
    width: "90%",
    paddingHorizontal: 10,
    zIndex: 2,
    borderRadius: 25,
  },
  buttonText: {
    flex: 1,
    textAlign: "center",
    color: "black",
    zIndex: 2,
  },
  dropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    top: 75,
    zIndex: 2,
  },
  dropdownItem: {
    // position: "absolute",
    // height: 120,
    backgroundColor: "#fff",
    top: 2,
    zIndex: 2,
    flexWrap: "wrap",
    flexDirection: "row",
    // padding: 6,
  },
});
