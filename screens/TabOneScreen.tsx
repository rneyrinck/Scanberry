import { StyleSheet, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
// import { stat } from 'fs';
export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not yet scanned");
  // storage for scanned item information
  const [scannedItemStorage, setScannedItemStorage] = useState({});
  // list of user saved items pulled from scan api call
  const [productList, setProductList] = useState([
   {}
  ]);
  const baseUrl = "https://api.barcodelookup.com/v3/products?barcode=";
  const apiKey = "&formatted=y&key=krrps3snh5q72np1iektbej3l34vmb";
  // example fetch for barcode lookup
  // https://api.barcodelookup.com/v3/products?barcode=9780140157376&formatted=y&key=krrps3snh5q72np1iektbej3l34vmb

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status == "granted");
    })();
  };
  //formula for isolating US based stores from api call

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
        console.log(newValueToBeStored)
        // store api request data in state for customer review
        setScannedItemStorage(newValueToBeStored)
        // const productListCopy = [...productList];
        // productListCopy.push();
      })
      .then(()=>console.log(scannedItemStorage))
      .catch(err=> console.log(err))
  };

  // Add scannedItemStorage data to productList -> called when button "add to cart" in popup when item is scanned is pressed
  const addScannedItemStorageToProductList = () => {
    // copy current productlist contents as variable
    let productListCopy = [...productList]
    // add scanned item info from scannedItemStorage to product list copy
    productListCopy.push(scannedItemStorage)
    // set product list state as updated list 
    setProductList(productListCopy)
  }


  // request camera permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // what happens when we scan bar code
  function handleBarCodeScanned({ type, data }) {
    setScanned(true);
    setText(data);
    getInfoFromBarCode(data)
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

  // retuurn the view
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
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
          onPress={()=>addScannedItemStorageToProductList()}
        />

        </View>
      )}
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
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
});
