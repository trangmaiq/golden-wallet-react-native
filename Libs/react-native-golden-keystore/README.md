
# react-native-golden-keystore

## Getting started

`$ npm install react-native-golden-keystore --save`

### Mostly automatic installation

`$ react-native link react-native-golden-keystore`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-golden-keystore` and add `RNGoldenKeystore.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNGoldenKeystore.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNGoldenKeystorePackage;` to the imports at the top of the file
  - Add `new RNGoldenKeystorePackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-golden-keystore'
  	project(':react-native-golden-keystore').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-golden-keystore/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-golden-keystore')
  	```


## Usage
```javascript
import RNGoldenKeystore from 'react-native-golden-keystore';

// TODO: What to do with the module?
RNGoldenKeystore;
```
  