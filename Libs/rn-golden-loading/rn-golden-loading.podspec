require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "rn-golden-loading"
  s.version      = package['version']
  s.summary      = "Loading view native module for iOS + Android"

  s.authors      = { "viettranx" => "viettranx@gmail.com" }
  s.license      = "MIT"
  s.platform     = :ios, "9.0"

  s.source_files  = "ios/**/*.{h,m}"
  s.homepage      = 'https://'
  s.source        = { :path => '.' }
  s.requires_arc  = true
  s.static_framework = true

  s.dependency 'React'
end
