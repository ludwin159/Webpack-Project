const path = require('path') // Plugin para usar Webpack, 100% necesario, no es necesario ya que es nativo
const HtmlWebpackPlugin = require('html-webpack-plugin')// plugin compilar html, esta si es necesario instalar como dependencia
const MiniCssExtractPlugin = require('mini-css-extract-plugin')// este es el plugin para añadir el css a la carpeta dist
const CopyPlugin = require('copy-webpack-plugin')//uso del plugin copi webpack, para copiar archivos como fotos o icons
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

//Para la manipulación de variables de entorno
const Dotenv = require('dotenv-webpack')

//aqui si es necesario tener bien organizada
const { CleanWebpackPlugin } = require('clean-webpack-plugin')



module.exports = {
  /* ESTABLECIENDO LA ENTRADA Y SALIDA */
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/images/[hash][ext][query]'
  },
  mode: "production",
  /*Para saber con que extensiones se va a utilizar*/
  resolve: {
    extensions: ['.js'],
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@templates': path.resolve(__dirname, 'src/templates'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
    }
  },
  /* La parte para la configuración */
  module: {
    /* Reglas a establecer */
    rules: [
      {//PARA COMPILAR LOS ARCHIVOS JAVASCRIPT
        /* TEST PERMITE SABER QUE TIPO DE EXTENSIONES VA A LEER */
        test: /\.m?js$/, //EL /\.m?js$/busca la terminacion de mjs que son los modulos o js, como esta el ? no es necesario la m
        /* PARA EXCLUIR LOS ELEMENTOS QUE NO VIENEN AL CASO COMO LOS DE NODE MODULES, YA QUE SE ROMPERIA LA APP DE PLANO */
        exclude: /node_modules/,
        //use ES PARA PASAR INTERNAMENTE EL LOADER QUE VAMOS A UTILIZAR
        use: {
          loader: 'babel-loader'
        }
      },
      //Creamos la configuración para css luego de llamar nuestro plugin con require
      {
        //darle los parametros
        test: /\.css|.styl$/i,
        //que vamos a usar
        use: [MiniCssExtractPlugin.loader,
        'css-loader',
        'stylus-loader'
        ],
      },
      {
        test: /\.png/,
        type: 'asset/resource'
      },
      {
        //regla
        test: /\.(woff|woff2)$/,
        //con que trabajamos
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            //caraccteristicas que tiene el formato
            mimetype: 'application/font-woff',
            //que respete el nombre qsue tiene y también la extension
            name: "[name].[contenthash].[ext]",
            //hacia donde lo enviaremos
            outputPath: "./assets/fonts/",
            //para el path
            publicPath: "../assets/fonts/",
            //para no usar esModule lo ponemos en false
            esModule: false,
          },
        }
      }
    ]
  },
  //EN PLUGIN SE PASA LOS PLUGIN QUE SON REQUERIDOS
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,// Para hacer la inserción de los elementos
      template: './public/index.html',// Ubicación de la pagina o template
      filename: './index.html'// Resultado de la aplicación y con que nombre se quiere, pues ./ para que sea fuera del dist
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css'
    }),//una nueva instancia del Css, o recurso

    //INSTANCIAR COPY PLUGIN
    new CopyPlugin({
      patterns: [
        //dentro del objeto es especificado desde donde y hacia donde lo vamos a mover
        {
          from: path.resolve(__dirname, "src", "assets/images"),
          to: "assets/images"
        }
      ]
    }),
    //con esto ya estaa añadido la configuración
    new Dotenv(),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin(),
    ]
  }
}