//В общем эта вещь позволяет указывать пути для определенных свойств в конфиге, без этой вещи например аутпут не работает и некоторые другие,
//просто принять это как должное
const path = require('path');
/*
Что я имею в пекедже
"scripts": {
    "start": "webpack serve --mode development --open",
    "test": "echo \"Error: no test specified\" && exit 1",
    cross-env NODE_ENV - объявление переменной, с помощью кросс-енв, чтоб все заработало нужно установить в девДеп cross-env
    "build": "cross-env NODE_ENV=production webpack --mode production --watch",
    "build-dev": "cross-env NODE_ENV=development webpack --mode development --watch"
},
В общем, это скрипты и допустим Билд - он при запуске явно указывает что переменная НОД_ЕНВ = пород, а также --мод прод что значит мод продакшн
--вач это про то что фиксация изменений
так вот 
в модульюекспортс тогда поле мод уу нас становится продакшн а переменная ниже мод возвращает Фалс, а модРеверс соотв Тру,
в зависимости от этих переменных некоторые свойства ниже определяют какой режим проИлидев и делают чтото
например все минификации происходят только при Прод моде, 
можешь поинспектить код и все поймешь
*/
const mode = process.env.NODE_ENV === 'development'
const modeReverse = !mode
/*
Этот плагин делает следующее: он позволяет оставить файл хтмл в срс папке,а плагин уже сам закинет после ранбилда этот файл в Дист папку
при этом оставит все внутренности так как я их описал как мне надо, но при этом САМ добавит все <scripts>, то есть все css and js придут сами
*/
const HTMLwebpackPlugin = require('html-webpack-plugin')
/*
Обычно я в индек.жс пропишу импорт до css файла в сорсе а на выходе получу style тег в хтмл, не круто
но этот плагин сам пересоздает css файлик после сборки и сам его подключает
*/
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//минифицирует сисс код
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
//минифицирует жс код
const TerserWebpackPlugin = require('terser-webpack-plugin')
//инициализируем ЕСЛинт
const ESLintPlugin = require('eslint-webpack-plugin');
//for hotreload
const webpack = require('webpack');

module.exports = {
    //указываем контекст - где исходники с которыми вебпак должен поколдовать
    context: path.resolve(__dirname, 'src'),
    //указываем мод
    //mode: 'development',
    //указываем точку входа, может быть не одна
    entry: './index.js',
    //указываем в какую папку все должно итоговое идти и как называться итоговый жс файл
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    //позволяет делать так что раньше пусть указываем так ./src/index.js, но раз я указал ниже .js тогда я могу путь указывать теперь вот так ./src/index, правда не понятно как конфликт имен решаться будет
    //*добавил расширение для реакта
    resolve: {
        extensions: ['.js','.css','.scss', '.jsx', '.svg']
    },
    //как и написано - оптимизация, важно что оптимизация/минификация только в продакшене, ну и укажи плагины для минификаций
    optimization: {
        minimize: modeReverse,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin()
        ]
    },
    //тут указываются лодеры, ребята которые расширяют функционал вебпака и позволяют работать с файлами другими не только с жс
    module: {
        rules: [
            //указываем что БАБЕЛ должен обрабатывать жс файлы 
            //кроме папки нод модульс
            //и для обработки юзать лодер бабел-лодер
            //*Важно что еще нужен .babelrc где мы объявляем плагины и пресеты бабела чтоб все работало корректно
            //*Добавил расширеямость на jsx
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            //указываем что все файлы .сисс должны обрабатываться сисс-лодером а затем МиниСиссЕкстрактПлагинюлодером(в юзе справа налево идут лодеры)
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            //сейс как выше просто сначала нужен сасс лодер для сасс/scss файлов
            {
                test: /\.s[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            //upd from 18/11/22
            //добавляем лоадер для свг
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: ['@svgr/webpack'],
            },
        ]
    },
    //тут указываем плагины
    plugins: [
        //тот самый хтмл плагин что пересоздает хтмл файл
        new HTMLwebpackPlugin({
            //указываем то в срс такой то есть хтмл файл
            template: './index.html',
            //а эта настройка минифицирует хтмл код при продакшн моде
            minify: {
                collapseWhitespace: modeReverse
            }
        }),
        //плагин который пересоздает scss
        new MiniCssExtractPlugin(),
        //Линтер
        new ESLintPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    /*
    Позволяет делать так что при сборке, если ошибка в коде, без этой настройки будет main.js строка 9, но если мы перейдем там просто будет
    длиннющая минифицированная строка жс кода, где ошибка хер проссышь, НО
    с этой настройкой в девтулс мы уидим index.js - и покажет где в Исходном коде и на какой строке ошибка
    */
    devtool: 'source-map',
    /*
    позволяет нам сделать след
    сначала нужно установить вебпак сервер
    указать в скриптах в пекедже "start": "webpack serve --mode development --open", где webpack serve - отслеживание изменений в режиме реального
    времени, --мод дев - значит все в режиме дев, --опен - значит что npm start сам запустит страничку в браузере
    то есть по факту лайв сервер реализован нами самими
    */
    devServer: {
        //по идее все ctrl+s отображают изменения но без перезагрузки страницы
        hot: mode,
        historyApiFallback: true,
        open: true,
        compress: true,
        //указываем что нужно запускать на лайв сервере нужно именно итоговую папку дист
        static: {
            directory: path.join(__dirname, 'dist'),
        },
    },
}
