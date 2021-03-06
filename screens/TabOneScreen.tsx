import {
  StyleSheet,
  Button,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  ScrollView,
  TextInput,
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
  // camera permission
  const [hasPermission, setHasPermission] = useState(null);
  // boolean for if scanner has stored information
  // default = false
  const [scanned, setScanned] = useState(false);
  // text indicating barcode has scanned item
  const [text, setText] = useState("Not yet scanned");
  // usestate for current budget
  const [budget, setBudget] = useState(10);
  // current total is added up price of all items in cart
  const [currentTotal, setCurrentTotal] = useState(0);
  // estimated tax rate > placeholder as an average tax rate of %6.25
  const [taxRate, setTaxRate] = useState(0.0625);
  //  topcard icon down/up state
  const [topCardDropDownCaret, setTopCardDropDownCaret] =
    useState("caret-down");
  // storage for scanned item information
  // default -> {}
  const [scannedItemStorage, setScannedItemStorage] = useState({});
  // list of user saved items pulled from scan api call -> defualt is empty
  const [productList, setProductList] = useState([]);
  // state for holding color of topcard budget indicator
  const [budgetCardIconColor, setBudgetCardIconColor] = useState("#00ff00");
  // amount of a single scanned item to be added
  const [amountOfProductToAdd, setAmountOfProductToAdd] = useState(1);
  // overlay visibility for productlist and bduget
  const [visible, setVisible] = useState(false);
  // urls for api call
  const baseUrl = "https://api.barcodelookup.com/v3/products?barcode=";
  const apiKey = "&formatted=y&key=5nj8e8eiih06xvnv64mq4ew5i38vpb";

  // example fetch for barcode lookup
  // https://api.barcodelookup.com/v3/products?barcode=9780140157376&formatted=y&key=krrps3snh5q72np1iektbej3l34vmb

  // Set budget Modal -> start as true
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(true);
  // budget modal spending goal view background color array
  const [budgetModalGoalBackGroundColor, setBudgetModalGoalBackGroundColor] =
    useState(["#ADD8E6", "#ADD8E6", "#ADD8E6", "#ADD8E6", "#ADD8E6"]);
  //  budget model spending goal button text color array
  const [budgetModalButtonTextColor, setBudgetModalButtonTextColor] = useState([
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
  ]);
  // set budget modal function
  const handleModal = () =>
    setIsBudgetModalVisible(() => !isBudgetModalVisible);

  // custom amount modal selected from budget modal
  const [
    isBudgetModalNestedCustomAmountModalVisible,
    setIsBudgetModalNestedCustomAmountModalVisible,
  ] = useState(false);
  // custom amount input modal
  const handleBudgetModalNestedCustomAmountModalVisible = () =>
    setIsBudgetModalNestedCustomAmountModalVisible(
      () => !isBudgetModalNestedCustomAmountModalVisible
    );
  // custom amount use state hook for number input
  const [number, onChangeNumber] = useState(0);
  // tutorial modal usestate for appearance when users need help with what app does
  const [isTutorialModalVisible, setIsTutorialModalVisible] = useState(false);
  // tutorial screen modal
  const handleIsTutorialModalVisible = () =>
    setIsTutorialModalVisible(() => !isTutorialModalVisible);
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
  };

  // setting up permissions for camera use
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
        // store api request data in state for customer review
        setScannedItemStorage(newValueToBeStored);
      })

      .catch((err) => console.log(err));
  };

  // not sure if this needs to be called or can be deleted



  // array holding information for tutorial modal
  const [tutorialSlideIndex, setTutorialSlideIndex] = useState(0);
  // function for generating tutorial modal information
  const generateTutorialModalContent = () => {
    // starting slide -> similar functionality accross five slides===notes on the first and on changes in each
    if (tutorialSlideIndex === 0) {
      return (
        <View
          style={{
            alignSelf: "center",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* skip button sends user to scan page */}
          <View style={{ position: "absolute", top: -70, right: -20 }}>
            <Button
              title="Skip"
              onPress={() => setIsTutorialModalVisible(false)}
            />
          </View>
          {/* spacer */}
          <View style={{ height: 100 }}></View>
          {/* simple icon */}
          <Ionicons
            name="cart"
            style={{ alignItems: "center" }}
            size={40}
            color="white"
          />
          {/* spacer */}
          <View style={{ height: 80 }}></View>
          <Text
            style={{
              alignSelf: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: "600",
              textAlign: "center",
              width: 250,
            }}
          >
            Say goodbye{"\n"} to surprises in the {"\n"}checkout line.
          </Text>
          {/* spacer */}
          <View style={{ height: 120 }}></View>
          {/* Radio buttons used as a way for usuers to visualize what tutorial screen theyre on(keeps them engaged by knowing the length of the tutorial) */}
          <View
            style={{
              flexDirection: "row",
              height: 40,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* radio-button-on indicates the selected tutorial screen --- switches based on the index of 0-4 for what page user is on */}
            <Ionicons
              name="radio-button-on"
              color="#fff"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
          </View>
          {/* spacer */}
          <View style={{ height: 60 }}></View>
          {/* button sending user to next page or closes modal if it the last page */}
          <TouchableOpacity
            style={{
              backgroundColor: "#7a42f4",
              padding: 10,
              // bottom: -100,
              // marginTop: 50,
              margin: 15,
              height: 80,
              width: 300,
              borderRadius: 20,
              justifyContent: "center",
            }}
            onPress={() => {
              setTutorialSlideIndex(tutorialSlideIndex + 1);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              {" "}
              Take the tour{" "}
            </Text>
          </TouchableOpacity>
        </View>
      );
      // spending goal slide -> back button appears on subsequent slides to send user back one slide, contains image showing user what to expect and how to use the app
    } else if (tutorialSlideIndex === 1) {
      return (
        <View
          style={{
            alignSelf: "center",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ position: "absolute", top: -20, left: -20 }}>
            <Button
              title="Back"
              onPress={() => setTutorialSlideIndex(tutorialSlideIndex - 1)}
            />
          </View>
          <View style={{ position: "absolute", top: -20, right: -20 }}>
            <Button
              title="Skip"
              onPress={() => {
                setTutorialSlideIndex(0);
                setIsTutorialModalVisible(false);
              }}
            />
          </View>
          <View style={{ height: 80 }}></View>
          <Image
            source={require("../assets/images/SetBudget.jpg")}
            style={{ height: 400, width: 300, backgroundColor: "#fff" }}
          />
          <View style={{ height: 20 }}></View>
          <Text
            style={{
              alignSelf: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: "600",
              textAlign: "center",
              width: 250,
            }}
          >
            Create a{"\n"}spending goal
          </Text>
          <View style={{ height: 20 }}></View>
          <View
            style={{
              flexDirection: "row",
              height: 40,
              // width: 20,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              // marginTop: 50,
              // marginBottom: 50
            }}
          >
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-on"
              color="#fff"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
          </View>
          <View style={{ height: 30 }}></View>
          <TouchableOpacity
            style={{
              backgroundColor: "#7a42f4",
              padding: 10,
              // bottom: -100,
              // marginTop: 50,
              margin: 15,
              height: 80,
              width: 300,
              borderRadius: 20,
              justifyContent: "center",
            }}
            onPress={() => {
              setTutorialSlideIndex(tutorialSlideIndex + 1);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              {" "}
              Next{" "}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (tutorialSlideIndex === 2) {
      return (
        <View
          style={{
            alignSelf: "center",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ position: "absolute", top: -20, left: -20 }}>
            <Button
              title="Back"
              onPress={() => setTutorialSlideIndex(tutorialSlideIndex - 1)}
            />
          </View>
          <View style={{ position: "absolute", top: -20, right: -20 }}>
            <Button
              title="Skip"
              onPress={() => {
                setTutorialSlideIndex(0);
                setIsTutorialModalVisible(false);
              }}
            />
          </View>
          <View style={{ height: 80 }}></View>
          <Image
            source={require("../assets/images/ScanOnTheGo.jpg")}
            style={{
              height: 400,
              width: 300,
              backgroundColor: "#fff",
              alignContent: "center",
            }}
          />
          <View style={{ height: 20 }}></View>
          <Text
            style={{
              alignSelf: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: "600",
              textAlign: "center",
              width: 250,
            }}
          >
            Scan items as{"\n"}you go
          </Text>
          <View style={{ height: 20 }}></View>
          <View
            style={{
              flexDirection: "row",
              height: 40,
              // width: 20,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              // marginTop: 50,
              // marginBottom: 50
            }}
          >
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-on"
              color="#fff"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
          </View>
          <View style={{ height: 30 }}></View>
          <TouchableOpacity
            style={{
              backgroundColor: "#7a42f4",
              padding: 10,
              // bottom: -100,
              // marginTop: 50,
              margin: 15,
              height: 80,
              width: 300,
              borderRadius: 20,
              justifyContent: "center",
            }}
            onPress={() => {
              setTutorialSlideIndex(tutorialSlideIndex + 1);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              {" "}
              Next{" "}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (tutorialSlideIndex === 3) {
      return (
        <View
          style={{
            alignSelf: "center",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ position: "absolute", top: -20, left: -20 }}>
            <Button
              title="Back"
              onPress={() => setTutorialSlideIndex(tutorialSlideIndex - 1)}
            />
          </View>
          <View style={{ position: "absolute", top: -20, right: -20 }}>
            <Button
              title="Skip"
              onPress={() => {
                setTutorialSlideIndex(0);
                setIsTutorialModalVisible(false);
              }}
            />
          </View>
          <View style={{ height: 80 }}></View>
          <Image
            source={require("../assets/images/KeepTrack.jpg")}
            style={{ height: 400, width: 300, backgroundColor: "#fff" }}
          />
          <View style={{ height: 20 }}></View>
          <Text
            style={{
              alignSelf: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: "600",
              textAlign: "center",
              width: 250,
            }}
          >
            Keep track{"\n"}while you shop
          </Text>
          <View style={{ height: 20 }}></View>
          <View
            style={{
              flexDirection: "row",
              height: 40,
              // width: 20,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              // marginTop: 50,
              // marginBottom: 50
            }}
          >
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-on"
              color="#fff"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
          </View>
          <View style={{ height: 30 }}></View>
          <TouchableOpacity
            style={{
              backgroundColor: "#7a42f4",
              padding: 10,
              // bottom: -100,
              // marginTop: 50,
              margin: 15,
              height: 80,
              width: 300,
              borderRadius: 20,
              justifyContent: "center",
            }}
            onPress={() => {
              setTutorialSlideIndex(tutorialSlideIndex + 1);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              {" "}
              Next{" "}
            </Text>
          </TouchableOpacity>
        </View>
      );
      // final page most similar to first -> "next" button closes modal and opens set budget modal
    } else if (tutorialSlideIndex === 4) {
      return (
        <View
          style={{
            alignSelf: "center",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ position: "absolute", top: -20, left: -20 }}>
            <Button
              title="Back"
              onPress={() => setTutorialSlideIndex(tutorialSlideIndex - 1)}
            />
          </View>
          <View style={{ position: "absolute", top: -20, right: -20 }}>
            <Button
              title="Skip"
              onPress={() => {
                setTutorialSlideIndex(0);
                setIsTutorialModalVisible(false);
              }}
            />
          </View>
          <View style={{ height: 80 }}></View>
          <View style={{ height: 190, width: 300, backgroundColor: "#000" }} />
          <Ionicons name="thumbs-up-sharp" color={"#fff"} size={35} />
          <View style={{ height: 60 }}></View>
          <Text
            style={{
              alignSelf: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: "600",
              textAlign: "center",
              width: 250,
            }}
          >
            Ready?
          </Text>
          <View style={{ height: 130, width: 300, backgroundColor: "#000" }} />
          <View style={{ height: 20 }}></View>
          <View
            style={{
              flexDirection: "row",
              height: 40,
              // width: 20,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              // marginTop: 50,
              // marginBottom: 50
            }}
          >
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-off"
              color="white"
              style={{ margin: 5 }}
            />
            <Ionicons
              name="radio-button-on"
              color="#fff"
              style={{ margin: 5 }}
            />
          </View>
          <View style={{ height: 30 }}></View>
          <TouchableOpacity
            style={{
              backgroundColor: "#7a42f4",
              padding: 10,
              // bottom: -100,
              // marginTop: 50,
              margin: 15,
              height: 80,
              width: 300,
              borderRadius: 20,
              justifyContent: "center",
            }}
            onPress={() => {
              setIsTutorialModalVisible(false);
              setIsBudgetModalVisible(true);
              setTutorialSlideIndex(0);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              {" "}
              Let's do this{" "}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  // request camera permission
  useEffect(() => {
    askForCameraPermission();
    getCurrentTotalFromProductList();
  }, []);

  // what happens when we scan bar code
  function handleBarCodeScanned({ type, data }) {
    setScanned(true);
    getInfoFromBarCode(data);
    console.log("Type: " + type + "\nData: " + data);
  }

  // check permission and return the screens
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
  // dropdown for the top budget card in scanning page
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
              backgroundColor: "rgba(52, 52, 52, 0)",
              top: 75,
              zIndex: 2,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              width: "100%",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                height: 10,
              }}
            ></View>

            <View
              style={{
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,

                backgroundColor: "#fff",
              }}
            >
              {/* mapping through list to create item cards */}
              {productList.map((item, index) => {
                return (
                  // productlist single itemcard
                  <View
                    style={{
                      backgroundColor: "#fff",
                      flexGrow: 1,
                      flex: 1,
                      flexDirection: "row",
                      padding: 6,
                    }}
                    key={index}
                  >
                    {/* item image */}
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: 50, height: 50 }}
                    />
                    {/* title */}
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
                    {/* price */}
                    <Text style={{ color: "#000", alignSelf: "center" }}>
                      ${parseFloat(item.price).toFixed(2)}
                    </Text>
                    {/* spacer */}
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
            {/* beveled view to give list borderradius of 20 */}
            <View
              style={{
                backgroundColor: "#fff",
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                height: 10,
                marginTop: 1,
              }}
            ></View>

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
                {/* totals breakdown */}
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
                {/* percentage of budget === current total divided by budget */}
                <Text style={{ color: "#000" }}>
                  {((currentTotal / budget) * 100).toFixed(0)}% of spending goal
                </Text>
                {/* edit bduget */}
                <Button title={"Edit"} onPress={handleModal} />
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
            zIndex: 2,
            flexWrap: "wrap",
            flexDirection: "row",
            margin: 2,
          }}
        >
          {/* topcard colored budget indicator icon */}
          <View
            style={{
              borderRadius: 20,
              height: 60,
              width: 60,
              backgroundColor: budgetCardIconColor,
              justifyContent: "center",
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
            <Ionicons name={topCardDropDownCaret} size={32} color="black" />
          </View>
        </View>

        <Text style={styles.buttonText}></Text>
      </TouchableOpacity>
    );
  };

  // return the updated view after scan
  return (
    <View style={styles.container}>
      {/* bubdget dropdown card */}
      <Dropdown label={`ProductList`} />

      {/* set budget modal opens on edit button in budget dropdown card */}
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
          <Text
            style={{
              width: "50%",
              textAlign: "center",
              lineHeight: 20,
              marginBottom: 20,
            }}
          >
            Choose from preset amounts or enter a custom amount
          </Text>
          {/* each of these following five views contains a button with an onPress function that changes the backgroundcolor, button text color, and sets bugdet(except for custom amount) */}

          {/* view with background color as state in array with each view/button group corresponding indescending order to their index in budgetModalBackgroundColor useState array */}
          {/* $20.00 button */}
          <View
            style={{
              margin: 1,
              backgroundColor: budgetModalGoalBackGroundColor[0],
              width: "80%",
              height: 50,
              borderRadius: 2,
              justifyContent: "center",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            {/* all buttons are similar with only chagnes being their correlation to the use state arrays for font color and background color changing */}
            {/* button with text color as array item (color code) on press changes the index corresponding to the button in descending order of all five buttons and changes everything else back to default light blue bacckground black font color */}
            <Button
              title="$20.00"
              color={budgetModalButtonTextColor[0]}
              onPress={() => {
                // copy of state array for manipulation
                let copyOfBackGroundColor = [
                  "#ADD8E6",
                  "#ADD8E6",
                  "#ADD8E6",
                  "#ADD8E6",
                  "#ADD8E6",
                ];
                // changing background color at index to show selection of this button
                copyOfBackGroundColor[0] = "#00008b";
                // setting background color use state array
                setBudgetModalGoalBackGroundColor(copyOfBackGroundColor);
                // make copy of button font color array for manipulation
                let copyOfButtonTextColor = [
                  "#000000",
                  "#000000",
                  "#000000",
                  "#000000",
                  "#000000",
                ];
                // chaning array at index to white for better contrast with darker blue
                copyOfButtonTextColor[0] = "#fff";
                // updating the usestate
                setBudgetModalButtonTextColor(copyOfButtonTextColor);
                // setting the budget use state
                setBudget(20);
              }}
            />
          </View>
          {/* $40.00 button */}
          <View
            style={{
              margin: 1,
              backgroundColor: budgetModalGoalBackGroundColor[1],
              width: "80%",
              height: 50,
              borderRadius: 2,
              justifyContent: "center",
            }}
          >
            <Button
              title="$40.00"
              color={budgetModalButtonTextColor[1]}
              onPress={() => {
                let copyOfBackGroundColor = [
                  "#ADD8E6",
                  "#ADD8E6",
                  "#ADD8E6",
                  "#ADD8E6",
                  "#ADD8E6",
                ];
                copyOfBackGroundColor[1] = "#00008b";
                setBudgetModalGoalBackGroundColor(copyOfBackGroundColor);
                let copyOfButtonTextColor = [
                  "#000000",
                  "#000000",
                  "#000000",
                  "#000000",
                  "#000000",
                ];
                copyOfButtonTextColor[1] = "#fff";
                setBudgetModalButtonTextColor(copyOfButtonTextColor);
                setBudget(40);
              }}
            />
          </View>
          {/* $60.00 button */}
          <View
            style={{
              margin: 1,
              backgroundColor: budgetModalGoalBackGroundColor[2],
              width: "80%",
              height: 50,
              borderRadius: 2,
              justifyContent: "center",
            }}
          >
            <Button
              title="$60.00"
              color={budgetModalButtonTextColor[2]}
              onPress={() => {
                let copyOfBackGroundColor = [
                  "#ADD8E6",
                  "#ADD8E6",
                  "#ADD8E6",
                  "#ADD8E6",
                  "#ADD8E6",
                ];
                copyOfBackGroundColor[2] = "#00008b";
                setBudgetModalGoalBackGroundColor(copyOfBackGroundColor);
                let copyOfButtonTextColor = [
                  "#000000",
                  "#000000",
                  "#000000",
                  "#000000",
                  "#000000",
                ];
                copyOfButtonTextColor[2] = "#fff";
                setBudgetModalButtonTextColor(copyOfButtonTextColor);
                setBudget(60);
              }}
            />
          </View>
          {/* $80.00 button */}
          <View
            style={{
              margin: 1,
              backgroundColor: budgetModalGoalBackGroundColor[3],
              width: "80%",
              height: 50,
              borderRadius: 2,
              justifyContent: "center",
            }}
          >
            <Button
              title="$80.00"
              color={budgetModalButtonTextColor[3]}
              onPress={() => {
                let copyOfBackGroundColor = [
                  "#ADD8E6",
                  "#ADD8E6",
                  "#ADD8E6",
                  "#ADD8E6",
                  "#ADD8E6",
                ];
                copyOfBackGroundColor[3] = "#00008b";
                setBudgetModalGoalBackGroundColor(copyOfBackGroundColor);
                let copyOfButtonTextColor = [
                  "#000000",
                  "#000000",
                  "#000000",
                  "#000000",
                  "#000000",
                ];
                copyOfButtonTextColor[3] = "#fff";
                setBudgetModalButtonTextColor(copyOfButtonTextColor);
                setBudget(80);
              }}
            />
          </View>
          {/* set custom amount button --- opens integerinput modal */}
          <View
            style={{
              margin: 1,
              backgroundColor: budgetModalGoalBackGroundColor[4],
              width: "80%",
              height: 50,
              borderRadius: 2,
              justifyContent: "center",
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <Button
              title="Custom amount"
              color={budgetModalButtonTextColor[4]}
              onPress={() => {
                let copyOfBackGroundColor = [
                  "#ADD8E6",
                  "#ADD8E6",
                  "#ADD8E6",
                  "#ADD8E6",
                  "#ADD8E6",
                ];
                copyOfBackGroundColor[4] = "#00008b";
                setBudgetModalGoalBackGroundColor(copyOfBackGroundColor);
                let copyOfButtonTextColor = [
                  "#000000",
                  "#000000",
                  "#000000",
                  "#000000",
                  "#000000",
                ];
                copyOfButtonTextColor[4] = "#fff";
                setBudgetModalButtonTextColor(copyOfButtonTextColor);
                handleBudgetModalNestedCustomAmountModalVisible();
              }}
            />
          </View>
          {/* on submit button for closing modal */}
          <TouchableOpacity
            style={{
              backgroundColor: "#7a42f4",
              padding: 10,
              margin: 15,
              height: 80,
              width: "80%",
              borderRadius: 20,
              justifyContent: "center",
            }}
            onPress={() => {
              setIsBudgetModalVisible(false);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
          {/* custom amount modal activated when custom amount button is pressed */}
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
                {/* close nested custom budget modal */}

                <Button
                  title={"Back"}
                  onPress={handleBudgetModalNestedCustomAmountModalVisible}
                  color={"white"}
                />
                {/* preset options for budget */}
              </View>
              <Text style={{ fontSize: 35, fontWeight: "600", margin: 10 }}>
                {" "}
                Spending Goal{" "}
              </Text>
              <Text
                style={{
                  width: "50%",
                  textAlign: "center",
                  lineHeight: 20,
                  marginBottom: 20,
                }}
              >
                Choose from preset amounts or enter a custom amount
              </Text>
              <View style={{ position: "relative" }}>
                <View
                  style={{
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    backgroundColor: "#ADD8E6",
                    width: 308,
                    alignSelf: "center",

                    // alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      color: "#000",
                      fontSize: 18,
                      fontWeight: "500",
                      width: 308,
                      height: 50,
                      textAlign: "center",
                      padding: 12,
                      // padding: 5,
                    }}
                  >
                    Custom Amount
                  </Text>
                </View>
                {/* input custom amount integer field */}
                <TextInput
                  style={{
                    height: 90,
                    // margin: 12
                    alignSelf: "center",
                    width: 310,
                    borderWidth: 1,
                    padding: 10,
                    backgroundColor: "#ADD8E6",
                    textAlign: "center",
                    fontSize: 40,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                  }}
                  onChangeText={onChangeNumber}
                  placeholderTextColor="#808080"
                  placeholder="$"
                  keyboardType="numeric"
                />
                {/* submit button for custom amount */}
                <TouchableOpacity
                  style={{
                    backgroundColor: "#7a42f4",
                    padding: 10,
                    margin: 15,
                    height: 80,
                    width: 300,
                    borderRadius: 20,
                    justifyContent: "center",
                  }}
                  // sets budget to input field value, closes budgetmodal and custom amount modals sending user back to scan screen
                  onPress={() => {
                    setBudget(number);
                    setIsBudgetModalVisible(false);
                    setIsBudgetModalNestedCustomAmountModalVisible(false);
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 20,
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    Submit{" "}
                  </Text>
                </TouchableOpacity>
                <View style={{ height: 120 }}></View>
              </View>
            </View>
          </Modal>
        </View>
      </Modal>
      {/* bottom right hand icon for information about the app */}
      <View style={{ position: "absolute", bottom: 20, right: 20 }}>
        <Ionicons
          name="information-circle-sharp"
          color={"white"}
          size={32}
          onPress={handleIsTutorialModalVisible}
        />
      </View>
      {/* explanation on how to use app */}
      <Modal visible={isTutorialModalVisible}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          {generateTutorialModalContent()}
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
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            position: "absolute",
            zIndex: 1,
            bottom: 110,
          }}
        >
          {/* top -> image and item card with plus/minus */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
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
              {/* button subtracts amount of product to add if it isnt zero */}
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
              {/* display number between plus/ minus sign */}
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
              width: 350,
              alignSelf: "center",
              borderRadius: 20,
              backgroundColor: "blue",
              height: 50,
              justifyContent: "center",
              marginTop: 1,
              padding: 2,
            }}
          >
            {/* for loop taking amount of items to be added and looping through add scannitemstorage to productlist */}
            <Button
              title={`Add to Cart                               $${
                scannedItemStorage.price * amountOfProductToAdd
              }`}
              onPress={() => {
                let productListCopy = [...productList];
                let priceToAdd = scannedItemStorage.price * taxRate;
                for (let i = 0; i < amountOfProductToAdd; i++) {
                  // add scanned item info from scannedItemStorage to product list copy
                  productListCopy.push(scannedItemStorage);
                  // set product list state as updated list
                  setProductList(productListCopy);
                  // set current total with new item added
                  setCurrentTotal(currentTotal + priceToAdd);
                }
                // revert scanned item to nothing
                setScannedItemStorage({});
                // set scanned to false -> closes item popup
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
          <View style={{ height: 40 }}></View>
        </View>
      )}
      <View style={{ height: 190 }}></View>
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
