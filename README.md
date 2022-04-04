

<!-- #### [GITHUB PAGES LINK]() -->
<!-- ![image](image file) -->
## PostProject Status
App functionality has been acheived, and in the next iteration I will implement the following changes.
- Refactor app into seperate components for leaner structure
- refactor modals into seperate pages
- research free/less-expensive barcode api for a deployed version
- revert dark theme stylign to light styling to adhere to original UI


## Project Description

Scanberry!

Full stack mobile application using React-Native, Python, Django, and postgreSQL. Users will be able to scan grocery items barcodes and add item with price and tax to a digitial cart to keep track of how much their total will be at checkout.

This app is a bridge for legacy groceries to compete with concepts like AMAZON-Go's walk-in/walk-out concept. The MVP will be a user service functionality based on a react-natives barcode scanning feature that will then take that scanned code and make an API call to a UPC database and return the price, name, and item description that the user can then add to their cart. The price will be added to a total and users will be able to visually keep track of their spending goals with a gas-tank like guage for their preset spending goal.

Future iterations would see the implementation of a locale based ping to get the users state and local tax information to add this to the total(instead of the preset federal tax average). Further iterations would include a feature to 'checkout' -> taking all items in their cart and generating a new barcode that encompasses all items in their cart where they will take this to the register and scan it(decreasing the time it takes at register to checkout large orders, and preparing customers of legacy grocery chains for a future walk-in/walk-out experience).

The design/concept of the app is credited to Mar Jorgenson, a senior UX designer at a Chicago Based real estate company who designed Scanberry as a capstone project in their UX bootcamp experience in 2021. The links to their Notion include:

- Heat mapping of user interactions
- Multiple iterations of wireframes based on user interactions
- Front end site map
- Design system for Scanberry
- High-fidelity prototype
- User Stories
- Survey results from over 100+ respondants

## Resources and Learning Required

- App with be utilizing React-Native for the front end and Django for the backend
  - [Tutorial for Django/React-Native](https://www.crowdbotics.com/blog/react-native-django-for-beginners)
- Front end functionality includes the following
  - [React-Native Barcode Scanning -> built in functionality for scanning barcodes](https://www.npmjs.com/package/react-native-scan-barcode)
  - [NPM react-guage-chart -> gas guage widget for data visualization of spending goal](https://www.npmjs.com/package/react-gauge-chart)
- Back end utilizes the following:
  - [Django Rest framework for keeping track of items in cart](https://www.crowdbotics.com/blog/react-native-django-for-beginners)
  - [Barcode API(either the free trial at barcode lookup or source a different API if it exists)](https://www.barcodelookup.com/api)
  - [Deployment of react native app to app store and google play](https://apiko.com/blog/deploying-react-native-apps-to-app-store-and-play-market/)

## Design Specifications

#### WireFrames

![Figma wireframes - Mar Jorgenson](https://www.figma.com/file/Ud7rIx5CyIpj7bfWVPxGtW?node-id=1320:4368)

#### Special Components

###### Guage Example

![Guage example](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F631afe44-73a0-4528-bbae-4415ce94e1bb%2Fimage_12.png?table=block&id=c04652a9-6c3d-481a-ba98-23eed8146d40&spaceId=34b1dba4-4815-4131-a50e-fdd812f2becb&width=1530&userId=6a07e3b1-3ab7-479f-a962-9709de9c4fa4&cache=v2)

###### Custom Spending Goal

![Custom spending goal component image](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fb1649b32-9fa4-4ef6-90ce-a8d1b239b526%2Fimage_22.png?table=block&id=68d01d88-45e0-431b-b629-479c6b5fb575&spaceId=34b1dba4-4815-4131-a50e-fdd812f2becb&width=1530&userId=6a07e3b1-3ab7-479f-a962-9709de9c4fa4&cache=v2)

###### Delete Item From Total

![Delete item component image](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F7133cc7b-7931-433e-a139-30ef1bf5d7ee%2Fimage_17.png?table=block&id=e04299e6-9ffe-4b55-be13-1058213457b6&spaceId=34b1dba4-4815-4131-a50e-fdd812f2becb&width=1530&userId=6a07e3b1-3ab7-479f-a962-9709de9c4fa4&cache=v2)

###### Landing Screen

![Landing Screen component image](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F87eb15aa-f27b-466d-bfac-319e6d118382%2Fimage_7.png?table=block&id=5fd15c04-91f7-4751-8661-b482bbe503bd&spaceId=34b1dba4-4815-4131-a50e-fdd812f2becb&width=1530&userId=6a07e3b1-3ab7-479f-a962-9709de9c4fa4&cache=v2)

###### Scanning Screen

![Scanning screen component image](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fa554a0a6-5e94-486c-ab15-0895ce5e4daa%2Fimage_27.png?table=block&id=a6d2b1f6-099e-4e0d-81c4-7bc992ad4645&spaceId=34b1dba4-4815-4131-a50e-fdd812f2becb&width=1530&userId=6a07e3b1-3ab7-479f-a962-9709de9c4fa4&cache=v2)

## User Stories

- [Olivia Richardson](https://www.notion.so/Olivia-Richardson-e36cd4ff7afe414da99c571eca8abe97)
- [Aaliyah Davis](https://www.notion.so/Aaliyah-Davis-f44d1a39a5a4416da5852b864eca2cd4)
- [Desmond Baker](https://www.notion.so/Desmond-Baker-83aeed3346934244b4e77f0f548fa1dd)

## Day Deliverable Status

- Day 1 ```3/25/2022``` Project Description/ markdown/ Project Planning Approved
- Weekend of ```3/25/2022``` Complete React-Native/React-Django Tutorials
- Day 2 ```3/28/2022``` Backend MVP
- Day 3 ```3/29/2022``` FrontEnd MVP
- Day 4 ```3/30/2022``` Float Day -> finish MVP and/or mvp deployment and testing
- Day 5 ```3/31/2022``` Post MVP -> Local tax rate calculator, final total barcode for quick register checkout
- Day 6 ```4/01/2022``` Styling -> Clean up documentation, remove errant code, Post MVP deployment testing

# Barcode Lookup API Information

[Barcode Lookup API Documentation](https://www.barcodable.com/documentation)

Signing up for a free trial of the API for testing and implementation -> for deployment a different API should be found to avoid the $99/mo subsription cost, or if product is tenable and marketable, could eat the cost if app is a paid product.

"Lookup products by UPC, EAN, or ASIN" - Barcode Lookup Docs

## Using the API

Base Url
`https://api.barcodelookup.com/v3/products?`
Additional, optional, parameters -> ScanBerry uses the Barcode functionality exclusively
`BaseUrl + barcode=978014015737`
API Key
`BaseUrl + Parameters + key=xxxxxxxxxxxxxx`

#### Example BarCode Lookup

Scanned barcode below, UPC code pulled and API request pulls below link
[190198155795](https://api.barcodable.com/api/v1/upc/190198155795)

#### Returned Results

```json
{
  "item": {
    "upc": "190198155795",
    "ean": "0190198155795",
    "matched_items": [
      {
        "asin": "B01LXU4VO7",
        "title": "Apple iPhone 7 Plus Unlocked Phone 32 GB - US Version (Black)",
        "mpn": "Plus Unlocked 32 GB - US (Black)",
        "part_number": "Plus Unlocked 32 GB - US (Black)",
        "upcs": ["190198155795"],
        "description": "The latest iPhone with advanced camera, better battery life, immersive speakers and water resistance!",
        "brand": "Apple",
        "manufacturer": "Apple",
        "color": "Black",
        "new_price": 729,
        "used_price": 699.99,
        "currency_code": "USD",
        "url": "https://www.amazon.com/Apple-Plus-Unlocked-32-GB/dp/B01LXU4VO7",
        "features": [
          "The 12-megapixel iSight camera captures sharp, detailed photos. It takes 4K video, up to four times the resolution of 1080p HD video.",
          "With just a single press, 3D Touch lets you do more than ever before.",
          "Multi-Touch display with IPS technology.",
          "Keep everything you love about iPhone up to date, secure, and accessible from any device with iCloud."
        ],
        "dimensions": {
          "package": {
            "height": 3.3,
            "height_units": "inches",
            "width": 5.5,
            "width_units": "inches",
            "length": 8.1,
            "length_units": "inches",
            "weight": 0.62,
            "weight_units": "pounds"
          },
          "item": {
            "height": 0.29,
            "height_units": "inches",
            "width": 3.07,
            "width_units": "inches",
            "length": 6.23,
            "length_units": "inches",
            "weight": 0.41,
            "weight_units": "pounds"
          }
        },
        "images": [
          "https://images-na.ssl-images-amazon.com/images/I/71yioMq-k7L.jpg",
          "https://images-na.ssl-images-amazon.com/images/I/61UU4UCazjL.jpg",
          "https://images-na.ssl-images-amazon.com/images/I/41mUrHVoTaL.jpg",
          "https://images-na.ssl-images-amazon.com/images/I/510QcIynH9L.jpg"
        ],
        "categories": ["Unlocked Cell Phones"]
      }
    ],
    "company_name": "Apple, Inc.",
    "company_address": "1 INFINITE LOOP # 35-DA3, CUPERTINO, CA 95014-2083, US",
    "iso_country_codes": ["US", "CA"]
  },
  "message": "OK",
  "status": 200
}
```

# Django Models --- N/A as of v.1

## Note on BackEnd
While a backend functionality would be nice for storing users carts longterm, and avoiding any mishaps with the app refreshing and removing the users cart -> in testing this only occured when the app would need to be restarted. 

Linking a backend database to a reactnative front-end proved surprisingly difficult with the current development environment(windows/gitbash) and in future iterations and further work in react native I will move to a mac environment to potentially avoid some of the connectivity issues experienced with scanberry.

#### Cart Item

- Item_Name: CharField
- Item_Company: CharField
- Item_Description: CharField
- Item_Price: Charfield
- Item_Bardcode: Charfield

## Python/Django

```py
#SCANBERRY-API/MODELS
class Item(models.Model):
    item_name = models.CharField
    item_company = models.CharField
    item_description = models.CharField
    item_price = models.CharField

#SCANBERRY-API/SERIALIZERS
# for interacting with items once added to list
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('id','item_name','item_company','item_description','item_price','item_barcode')
# for adding item to list
class AddItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('id','item_name','item_company','item_description','item_price','item_barcode')

#SCANBERRY-API/VIEWS
class ItemsView(APIView):
    # Adding new item to list of total items
    def post(self,request):

        item = AddItemSerializer(data=request.data)
        if item.is_valid():
            item.save()
            return Response(item.data, status=status.HTTP_201_CREATED)
        else:
            return Response(item.errors, status=status.HTTP_400_BAD_REQUEST)
    # to display all items in list of total items
    def get(self, request):
        #display items in total list belonging to this user
        items = Item.objects.get_objects_or_404(Item, pk=pk)
        data = ItemSerializer(items, many=True).data
        return Response(data)

# VIEW FOR DELETING ITEMS FROM CART
class SingleItemView(APIView):
    def delete(self, request, pk):
        #VERIFY ITEM IS IN CART WITH PARAM LIKE SEARCH
        item = get_object_or_404(Item, pk=pk)
        if request.user != item.owner:
            raise PermissionDenied('Unauthorized, you must login to add or remove items to a cart')
        item.delete()
        return Response(status=status HTTP_204_NO_CONTENT)
```
# Project Breakdown

## MVP

- React-Native front end with barcode scan
- User Signup/login
- Barcode/UPC scanned and created fetch request with that item info
- add items to cart, with interactability -> delete, add
- total cost of items with estimated tax
- Django/PostGreSQL backend storing user information, and current cart items

## POST MVP

- Location tax calculator
- final cart total upc generator for easy checkout

## REACT ARCHITECTURE

| Component                 |                                                                                                               Description                                                                                                                |
| ------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| App                       |                                                                                                  This will render the react components                                                                                                   |
| Tour Screens              |                                                                                         Six page app walkthrough describing functionality of app                                                                                         |
| Spending Goal Preset      |                                                            This will display a list of preset options for a user to specify a spending goal, includes link to 'custom amount'                                                            |
| Custom Goal Amount        |                                                            If user opted to set a specific amount as their goal this page gives them option to enter an amount for their goal                                                            |
| Goal guage                |                                          Gas guage data visualisation of current cost compared to spending goal, pressing the details link in top right hand displays item list and cost detail                                          |
| goal card                 |                                              Displays spending goal in color coded square alaong with current total and under/over budget message, presssing this card displays goal guage                                               |
| Cost detail and item list |                                              list of everything in cart with their prices, as well as tax and total estimation. bottom of card has an edit feature to change spending goal                                               |
| keep shopping button      |                                                                                button displayed on over lay cards to minimize all and return to scan page                                                                                |
| Scan page                 |                                                 Main functionality of app, open camera barcode scanning with cancel, retake, and select buttons for barcode functionality and camera use                                                 |
| scanned item popup        |                                          Overlay on scan page once item is scanned, displays picture of item, name, plus/minus for adding multiples, and an add to total button with item cost                                           |
| item added popup          | If scanned item is added to total popup displays 'added to total' with item name as small hero with image left and text right. Includes a preview total link to 'cost detail and item list' and a dismiss button to go back to scan page |

## CRUD Map

| **URL** | **HTTP Verb** | **Action** | **Description** |
| ------- | ------------- | ---------- | --------------- |
| /itemslist | GET | read | view all items in list |
| /additem | POST | create | add item to user list |
| /item/:itemId | Delete | destroy | remove item from user list |

## Time Estimation 
| Component     | Priority | Estimated Time | Actual Time |
| ------------- | -------- | -------------- | ----------- |
| Tour Screens       | M        | 3hr            |             |
| Spending Goal Preset   | H        | 3hr            |             |
| Custom Goal Amount      | H        | 2hr            |             |
| Goal Guage   | H        | 1hr            |             |
| Goal Card  | H        | 4hr            |             |
| Cost Detail and Item List          | H        | 6hr            |             |
| Keep Shopping Button      | H        | 1hr            |             |
| Scan Page         | H        | 6hr            |             |
| Scanned item popup | H        | 2hr            |             |
| Item added popup        | M        | 2hr            |             |
| Total         | H        | 30hr           |             |


