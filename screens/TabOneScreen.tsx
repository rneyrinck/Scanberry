import {
  StyleSheet,
  Button,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import React, { FC, useState, useEffect, ReactElement } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
// import Overlay from "react-native-modal-overlay";
import { View, Text } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import Colors from "../constants/Colors";
import Dropdown from "./TabTwoScreen";
import { wrap } from "module";
import { Ionicons } from "@expo/vector-icons";
// import React, { FC, useState } from 'react';
// import { StyleSheet, Text, TouchableOpacity } from 'react-native';
// import { View } from '../components/Themed';
export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [hasPermission, setHasPermission] = useState(null);
  // default false
  const [scanned, setScanned] = useState(true);
  const [text, setText] = useState("Not yet scanned");
  // usestate for current budget
  const [budget, setBudget] = useState(10);
  // current total is added up price of all items in cart
  const [currentTotal, setCurrentTotal] = useState(0);
  // estimated tax rate > placeholder as an average tax rate of %6.25
  const [taxRate, setTaxRate] = useState(0.0625);
  // storage for scanned item information
  // default -> {}
  const [scannedItemStorage, setScannedItemStorage] = useState({
    barcode: "766218109216",
    description:
      "Whether you are starting a DIY project, creating unique gifts or upcycling various odds and ends this highly-pigmented Americana Acrylic Color is ideal for decorative painting, home decor and general craft projects. The vibrant, rich acrylic color blends easily with others in the Americana line, producing smooth, creamy colors that dry to a durable matte finish. Transform a variety of surfaces including wood, canvas, plaster, resins, papier mache, candles, walls, fabric, leather, Styrofoam, ceramic bisque, polymer clay, paper, poster board, metal and more.",
    image: "https://images.barcodelookup.com/9614/96144763-1.jpg",
    price: "9.99",
    title: "DecoArt Americana Acrylic Color, 16 Oz., Slate Gray",
  });
  // list of user saved items pulled from scan api call -> defualt is empty
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
  // state for holding color of topcard budget indicator
  const [budgetCardIconColor, setBudgetCardIconColor] = useState("#00ff00");
  // amount of a single scanned item to be added
  const [amountOfProductToAdd, setAmountOfProductToAdd] = useState(1);
  // overlay visibility for productlist and bduget
  const [visible, setVisible] = useState(false);
  // urls for api call
  const baseUrl = "https://api.barcodelookup.com/v3/products?barcode=";
  const apiKey = "&formatted=y&key=krrps3snh5q72np1iektbej3l34vmb";

  // example fetch for barcode lookup
  // https://api.barcodelookup.com/v3/products?barcode=9780140157376&formatted=y&key=krrps3snh5q72np1iektbej3l34vmb

  // Set budget Modal
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
// budget modal spending goal view background color array
  const [budgetModalGoalBackGroundColor, setBudgetModalGoalBackGroundColor] = useState(['#ADD8E6','#ADD8E6','#ADD8E6','#ADD8E6','#ADD8E6'])
//  budget model spending goal button text color array
const [budgetModalButtonTextColor, setBudgetModalButtonTextColor] = useState(['#000000','#000000','#000000','#000000','#000000'])
const handleModal = () =>
    setIsBudgetModalVisible(() => !isBudgetModalVisible);

    // custom amount modal selected from budget modal
    const [isBudgetModalNestedCustomAmountModalVisible, setIsBudgetModalNestedCustomAmountModalVisible] = useState(false);

    const handleBudgetModalNestedCustomAmountModalVisible = () => setIsBudgetModalNestedCustomAmountModalVisible(() => !isBudgetModalNestedCustomAmountModalVisible);
  // formula for setting current total state by mapping through items in productlist and adding their price
  const getCurrentTotalFromProductList = () => {
    // variable holding added price as productlist is looped over
    let totalPlaceholder = 0;
    // looping over productlist array and adding each items price to the placeholder value
    for (let i = 0; i < productList.length; i++) {
      // value is a string, as each item is looped over changed price from str into integer with decimals(parsefloat)
      totalPlaceholder += parseFloat(productList[i].price);
    }
    // current total plus estimated average tax rate of %6.25
    totalPlaceholder += totalPlaceholder * taxRate;

    // update current total state with value of totalPlaceholder
    setCurrentTotal(totalPlaceholder);
  };
  //function for returning text in topcard that compares current total to budget and returns over/under by x amount message
  const currentTotalBudgetComparisonMessage = () => {
    if (currentTotal > budget) {
      setBudgetCardIconColor("#ff0000");
      return `$${(currentTotal - budget).toFixed(2)} over budget`;
    } else if (currentTotal < budget) {
      setBudgetCardIconColor("#00ff00");
      return `$${(budget - currentTotal).toFixed(2)} under budget`;
    }
    // console.log("get current total");
  };

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
    getCurrentTotalFromProductList();
    // alert that item has been added
    alert("Item added to cart!");
    // remove popup so use can continue scanning new items
    setScanned(false);
  };

  // request camera permission
  useEffect(() => {
    askForCameraPermission();
    getCurrentTotalFromProductList();
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
    setText("add to cart?");
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
          // view encapsulating all items in productlist
          <View
            style={{
              position: "absolute",
              backgroundColor: "#000",
              top: 75,
              zIndex: 2,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              // borderBottomLeftRadius: 20,
              // borderBottomRightRadius: 20,
            }}
          >
            {/* productlist top wrapper  */}
            <View
              style={{
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                backgroundColor: "#ADD8E6",
                height: 50,
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#000", fontSize: 25, fontWeight: "600" }}>
                Cart
              </Text>
            </View>
            {/* product list allitems view */}
            <View
              style={{
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                backgroundColor: "#fff",
                // height: 50,
                // width: 400
                // zIndex:
                // borderColor: "#00ff00",
                // borderWidth: 5
              }}
            >
              {/* mapping through list to create item cards */}
              {productList.map((item, index) => {
                // console.log(item.title);
                return (
                  // productlist single itemcard
                  <View
                    style={{
                      backgroundColor: "#fff",
                      flexGrow: 1,
                      flex: 1,
                      flexDirection: "row",
                      padding: 6,
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                    }}
                    key={index}
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
                    <Text style={{ color: "#000", alignSelf: "center" }}>
                      ${parseFloat(item.price)}
                    </Text>
                    <View
                      style={{
                        height: 1,
                        width: "110%",
                        position: "absolute",
                        backgroundColor: "#000",
                      }}
                    />
                  </View>
                  // </View>
                );
              })}
            </View>
            {/* details card underneath productlist */}
            <View
              style={{
                position: "relative",
                backgroundColor: "#fff",
                marginTop: 1,
                borderTopColor: "#fff",
                borderRadius: 20,
                height: 200,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "80%",
                  backgroundColor: "fff",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#000" }}>Taxes</Text>

                <Text style={{ color: "#000" }}>
                  ${(currentTotal * taxRate).toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  width: "80%",
                  backgroundColor: "fff",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#000" }}>Discounts</Text>

                <Text style={{ color: "#000" }}>$0.00</Text>
              </View>
              <View
                style={{
                  width: "80%",
                  backgroundColor: "#fff",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#000", fontWeight: "600" }}>Total</Text>

                <Text style={{ color: "#000", fontWeight: "600" }}>
                  ${currentTotal.toFixed(2)}
                </Text>
              </View>

              {/* spacer */}
              <View
                style={{
                  height: 1,
                  width: "110%",

                  backgroundColor: "#000",
                }}
              />
              {/* bottom of details card states % of total with button to edit budget */}
              <View
                style={{
                  width: "80%",
                  backgroundColor: "fff",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  paddingTop: 5,
                }}
              >
                <Text style={{ color: "#000" }}>
                  {((currentTotal / budget) * 100).toFixed(0)}% of spending goal
                </Text>

                <Button title={"Edit"} onPress={() => console.log("edit")} />
              </View>
            </View>
          </View>
        );
      }
    };

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
            <Text style={{ fontSize: 20, fontWeight: "600", color: "#000" }}>
              ${budget}
            </Text>
          </View>
          {/* text and information view for current total and comparison to budget */}
          <View
            style={{
              backgroundColor: "#fff",
              marginLeft: 30,
              flex: 1,
              flexDirection: "column",
              alignSelf: "center",
            }}
          >
            <Text style={{ marginBottom: 6, color: "fff" }}>
              Current total: ${currentTotal.toFixed(2)}
            </Text>
            {/* function for displaying over/under budget by x amount. Takes currenttotal minus budget and returns text with amount */}
            <Text style={{ fontWeight: "600", color: "fff" }}>
              {currentTotalBudgetComparisonMessage()}
            </Text>
          </View>
          {/* calling function for displaying items in productlist as a dropdown */}
          {renderDropdown()}
          <View
            style={{
              backgroundColor: "#fff",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="caret-down" size={32} color="black" />
          </View>
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
      <Button title="modal" onPress={handleModal} />
      {/* set budget modal -> here temporarily */}
      <Modal visible={isBudgetModalVisible}>
        <View
          style={{
            backgroundColor: "black",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              alignSelf: "flex-start",
              position: "absolute",
              top: 70,
              left: 10,
            }}
          >
            <Button title={"Close"} onPress={handleModal} color={"white"} />
            {/* preset options for budget */}
          </View>
          <Text style={{ fontSize: 35, fontWeight: "600", margin: 10 }}>
            {" "}
            Spending Goal{" "}
          </Text>
          <Text style={{ width: "50%", textAlign: "center", lineHeight: 20, marginBottom: 20 }}>
            Choose from preset amounts or enter a custom amount
          </Text>
          {/* each of these following five views contains a button with an onPress function that changes the backgroundcolor, button text color, and sets bugdet(except for custom amount) */}
          
          {/* view with background color as state in array with each view/button group corresponding indescending order to their index in budgetModalBackgroundColor useState array */}
          <View style={{margin:1,backgroundColor: budgetModalGoalBackGroundColor[0], width: '80%', height: 50,borderRadius: 2, justifyContent: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
            {/* button with text color as array item (color code) on press changes the index corresponding to the button in descending order of all five buttons and changes everything else back to default light blue bacckground black font color */}
            <Button title="$20.00" color={budgetModalButtonTextColor[0]} onPress={() => {
              // copy of state array for manipulation
              let copyOfBackGroundColor = ['#ADD8E6','#ADD8E6','#ADD8E6','#ADD8E6','#ADD8E6']
              // changing background color at index to show selection of this button
              copyOfBackGroundColor[0]='#00008b'
              // setting background color use state array
              setBudgetModalGoalBackGroundColor(copyOfBackGroundColor)
              // make copy of button font color array for manipulation
              let copyOfButtonTextColor = ['#000000','#000000','#000000','#000000','#000000']
              // chaning array at index to white for better contrast with darker blue
              copyOfButtonTextColor[0]='#fff'
              // updating the usestate 
              setBudgetModalButtonTextColor(copyOfButtonTextColor)
              // setting the budget use state
              setBudget(20)}} />
          </View>
          <View style={{margin:1,backgroundColor: budgetModalGoalBackGroundColor[1], width: '80%', height: 50,borderRadius: 2, justifyContent: 'center'}}>
            <Button title="$40.00" color={budgetModalButtonTextColor[1]} onPress={() => {
              let copyOfBackGroundColor = ['#ADD8E6','#ADD8E6','#ADD8E6','#ADD8E6','#ADD8E6']
              copyOfBackGroundColor[1]='#00008b'
              setBudgetModalGoalBackGroundColor(copyOfBackGroundColor)
              let copyOfButtonTextColor = ['#000000','#000000','#000000','#000000','#000000']
              copyOfButtonTextColor[1]='#fff'
              setBudgetModalButtonTextColor(copyOfButtonTextColor)
              setBudget(40)}} />
          </View>
          <View style={{margin:1,backgroundColor: budgetModalGoalBackGroundColor[2], width: '80%', height: 50,borderRadius: 2, justifyContent: 'center'}}>
            <Button title="$60.00" color={budgetModalButtonTextColor[2]} onPress={() => {
              let copyOfBackGroundColor = ['#ADD8E6','#ADD8E6','#ADD8E6','#ADD8E6','#ADD8E6']
              copyOfBackGroundColor[2]='#00008b'
              setBudgetModalGoalBackGroundColor(copyOfBackGroundColor)
              let copyOfButtonTextColor = ['#000000','#000000','#000000','#000000','#000000']
              copyOfButtonTextColor[2]='#fff'
              setBudgetModalButtonTextColor(copyOfButtonTextColor)
              setBudget(60)}} />
          </View>
          <View style={{margin:1,backgroundColor: budgetModalGoalBackGroundColor[3], width: '80%', height: 50,borderRadius: 2, justifyContent: 'center'}}>
            <Button title="$80.00" color={budgetModalButtonTextColor[3]} onPress={() => {
              let copyOfBackGroundColor = ['#ADD8E6','#ADD8E6','#ADD8E6','#ADD8E6','#ADD8E6']
              copyOfBackGroundColor[3]='#00008b'
              setBudgetModalGoalBackGroundColor(copyOfBackGroundColor)
              let copyOfButtonTextColor = ['#000000','#000000','#000000','#000000','#000000']
              copyOfButtonTextColor[3]='#fff'
              setBudgetModalButtonTextColor(copyOfButtonTextColor)
              setBudget(80)}} />
          </View>
          <View style={{margin:1,backgroundColor: budgetModalGoalBackGroundColor[4], width: '80%', height: 50,borderRadius: 2, justifyContent: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
            <Button title="Custom amount" color={budgetModalButtonTextColor[4]} onPress={() => {
              let copyOfBackGroundColor = ['#ADD8E6','#ADD8E6','#ADD8E6','#ADD8E6','#ADD8E6']
              copyOfBackGroundColor[4]='#00008b'
              setBudgetModalGoalBackGroundColor(copyOfBackGroundColor)
              let copyOfButtonTextColor = ['#000000','#000000','#000000','#000000','#000000']
              copyOfButtonTextColor[4]='#fff'
              setBudgetModalButtonTextColor(copyOfButtonTextColor)
              handleBudgetModalNestedCustomAmountModalVisible()}} />
          </View>
          <Modal visible={isBudgetModalNestedCustomAmountModalVisible}>
          <View
          style={{
            backgroundColor: "black",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              alignSelf: "flex-start",
              position: "absolute",
              top: 70,
              left: 10,
            }}
          >
            <Button title={"Back"} onPress={handleBudgetModalNestedCustomAmountModalVisible} color={"white"} />
            {/* preset options for budget */}
          </View>
          <Text style={{ fontSize: 35, fontWeight: "600", margin: 10 }}>
            {" "}
            Spending Goal{" "}
          </Text>
          <Text style={{ width: "50%", textAlign: "center", lineHeight: 20, marginBottom: 20 }}>
            Choose from preset amounts or enter a custom amount
          </Text>
          </View>

          </Modal>
        </View>
      </Modal>

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
        // scanned item popup
        <View
          style={{
            // backgroundColor: "#fff",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            position: "absolute",
            zIndex: 1,
            bottom: 100,
          }}
        >
          {/* top -> image and item card with plus/minus */}
          <View
            style={{
              backgroundColor: "#fff",

              borderRadius: 20,
              // flex: 1,

              justifyContent: "space-evenly",
            }}
          >
            <Image
              source={{ uri: scannedItemStorage.image }}
              style={{
                width: "100%",
                height: "50%",
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              }}
            />
            <View
              style={{
                backgroundColor: "#fff",
                flex: 1,
                flexDirection: "row",
                height: 100,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
              }}
            >
              <Text style={{ color: "#000", flexWrap: "wrap", flex: 1 }}>
                {scannedItemStorage.title}
              </Text>
              {/* button subtracts amount of producttoadd if it isnt zero */}
              <Button
                title={"-"}
                onPress={() => {
                  if (amountOfProductToAdd > 0) {
                    setAmountOfProductToAdd(amountOfProductToAdd - 1);
                  } else {
                    setAmountOfProductToAdd(amountOfProductToAdd);
                  }
                }}
              />
              <Text style={{ color: "#000" }}>{amountOfProductToAdd}</Text>
              <Button
                title={"+"}
                onPress={() =>
                  setAmountOfProductToAdd(amountOfProductToAdd + 1)
                }
              />
            </View>
          </View>
          {/* add to cart button view for styling */}
          <View
            style={{
              width: "100%",
              alignSelf: "center",
              borderRadius: 20,
              backgroundColor: "blue",
              height: 50,
              justifyContent: "center",
              marginTop: 1,
            }}
          >
            {/* for loop taking amount of items to be added and looping through add scannitemstorage to productlist */}
            <Button
              title={`Add to Cart                                $${
                scannedItemStorage.price * amountOfProductToAdd
              }`}
              onPress={() => {
                for (let i = 0; i < amountOfProductToAdd; i++) {
                  addScannedItemStorageToProductList();
                }
                setScanned(false);
              }}
              color="#fff"
            />
          </View>
          {/* scan again button view for styling */}
          <View
            style={{
              width: "100%",
              alignSelf: "center",
              borderRadius: 20,
              backgroundColor: "red",
              height: 50,
              justifyContent: "center",
              marginTop: 1,
            }}
          >
            <Button
              title={"Scan Again?"}
              onPress={() => {
                setText("Please Scan Item");
                setScanned(false);
              }}
              color="#fff"
            />
          </View>
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
    fontSize: 30,
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
