-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-05-2018 a las 13:56:13
-- Versión del servidor: 10.1.16-MariaDB
-- Versión de PHP: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `apptareas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas`
--

CREATE TABLE `tareas` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` varchar(250) NOT NULL,
  `autor` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ejecutor` int(11) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tareas`
--

INSERT INTO `tareas` (`id`, `titulo`, `descripcion`, `autor`, `fecha`, `ejecutor`, `estado`) VALUES
(1, 'Petanca', 'Jugar a la petanca con determinación', 1, '2004-11-25 12:33:12', 1, 0),
(3, 'parque', 'Drogarse en el parque', 1, '2013-12-04 17:40:12', 1, 1),
(4, 'Abonar', 'Abonar el césped', 2, '0000-00-00 00:00:00', 3, 0),
(5, 'crimen', 'acabar con el crimen en Baltimore', 2, '2002-04-24 00:45:20', 4, 0),
(7, 'barco', 'construir un barco', 2, '2005-01-01 15:00:00', 2, 0),
(8, 'Abonar', 'Abonar el césped para futura plantación de geranios', 3, '2008-05-24 16:14:00', 4, 1),
(9, 'Buscar', 'buscar el amor verdadero', 1, '2011-04-28 14:24:00', 1, 0),
(10, 'Resolución', 'Resolución del conflicto catalán', 1, '2017-02-24 22:10:00', 2, 0),
(11, 'holi dani', 'has sido altamente jackiado', 5, '2018-05-30 13:13:00', 5, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `usuario` varchar(100) NOT NULL,
  `pass` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `usuario`, `pass`) VALUES
(1, 'Pancho Sánchez', 'psanchez', 'abc123.'),
(2, 'Jacinto José', 'jacinjos', 'abc123.'),
(3, 'Urkel Johnson', 'ujohnson', 'guest'),
(4, 'Orson Rodríguez', 'orod', 'abc123.'),
(5, 'Doom Guy', 'doomguy', 'DOOM'),
(6, 'prueba', 'prueba', '1234');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tareas`
--
ALTER TABLE `tareas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
