/Applications/CocosCreator/Creator/2.4.3/CocosCreator.app/Contents/MacOS/CocosCreator --path . --build "platform=web-mobile"
#C:/Users/SQ/AppData/Local/Programs/CocosDashboard_1.0.6/resources/.editors/Creator/2.4.3/CocosCreator.exe --path . --build "platform=web-mobile"
cd ../../Others/review-thinyant-lucky-draw/
git pull
rm -rf *
cp -R ../../Elofun/thinyant-lucky-draw/build/web-mobile/* .
git add .
git commit -m 'update'
git push
cd ../../Elofun/thinyant-lucky-draw