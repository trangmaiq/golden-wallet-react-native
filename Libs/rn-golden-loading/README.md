
# react-native-golden-loading

## Getting started

`$ npm install react-native-golden-loading --save`

### Mostly automatic installation

`$ react-native link react-native-golden-loading`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-golden-loading` and add `RNGoldenLoading.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNGoldenLoading.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNGoldenLoadingPackage;` to the imports at the top of the file
  - Add `new RNGoldenLoadingPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-golden-loading'
  	project(':react-native-golden-loading').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-golden-loading/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-golden-loading')
  	```


## Usage
```javascript
import RNGoldenLoading from 'react-native-golden-loading';

// TODO: What to do with the module?
RNGoldenLoading;
```
  