import {
  StyleSheet,
  Button,
  TouchableOpacity,
  Modal,
  FlatList,
  
} from "react-native";
import React, { FC, useState, useEffect, ReactElement } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
// import Overlay from "react-native-modal-overlay";
import { View, Text } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import Colors from "../constants/Colors";
import Dropdown from "./TabTwoScreen";
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
  const [budget, setBudget] = useState(15);
  // storage for scanned item information
  const [scannedItemStorage, setScannedItemStorage] = useState({});
  // list of user saved items pulled from scan api call
  const [productList, setProductList] = useState([]);

  // overlay visibility for productlist and bduget
  const [visible, setVisible] = useState(false);
  // urls for api call
  const baseUrl = "https://api.barcodelookup.com/v3/products?barcode=";
  const apiKey = "&formatted=y&key=krrps3snh5q72np1iektbej3l34vmb";

  // example fetch for barcode lookup
  // https://api.barcodelookup.com/v3/products?barcode=9780140157376&formatted=y&key=krrps3snh5q72np1iektbej3l34vmb

  // const productListOverlay = () => {
  //   setVisible(true);
  //   onclose = () => setVisible(false);
  //   return (
  //     <Overlay visible={visible} onClose={onclose} closeOnTouchOutside>
  //       <Text>Model content = productList</Text>
  //     </Overlay>
  //   );
  // };

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
      .then(() => console.log(scannedItemStorage))
      .catch((err) => console.log(err));
  };
  console.log(scannedItemStorage);
  // Add scannedItemStorage data to productList -> called when button "add to cart" in popup when item is scanned is pressed
  const addScannedItemStorageToProductList = () => {
    // copy current productlist contents as variable
    let productListCopy = [...productList];
    // add scanned item info from scannedItemStorage to product list copy
    productListCopy.push(scannedItemStorage);
    // set product list state as updated list
    setProductList(productListCopy);
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

  // example code for dropdown picker
  // \/\/\/\/\/\/\/\/
  interface Props {
    label: string;
  }
  const Dropdown: FC<Props> = ({ label }) => {
    // teset data to be mapped over for
    const ProductListDisplayInDropdown = () => {
      productList.map((items, i) => {
        if (productList.length === 0) {
          console.log("length === 0")
          return <Text>Added items display here</Text>;
        } else {
          return (
            <View key={i}>
              <Text style={{backgroundColor: 'tomato'}}></Text>
              {/* <Text>{items.title}</Text> */}
            </View>
          );
        }
      });
    };

    const [visible, setVisible] = useState(false);

    const toggleDropdown = () => {
      setVisible(!visible);
    };

    const renderDropdown = () => {
      if (visible) {
        return (<Text style={styles.dropdown}>howdy</Text>)
      }
    };
    console.log(productList);
    return (
      <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
        {renderDropdown()}
        <Text style={styles.buttonText}>{label}</Text>
        {/* <Icon type='font-awesome' name='chevron-down'/> */}
      </TouchableOpacity>
    );
  };
  // \/\/\/\/\/\/\

  // return the updated view after scan
  return (
    <View style={styles.container}>
      <View>
        <Dropdown label="ProductList" />
        {/* <Dropdown label="Productlist" /> */}
      </View>
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
    backgroundColor: "#efefef",
    height: 50,
    width: "90%",
    paddingHorizontal: 10,
    zIndex: 1,
  },
  buttonText: {
    flex: 1,
    textAlign: "center",
  },
  dropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    top: 50,
    color: "#000"
  },
  
});
