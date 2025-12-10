<%@ page session="true" contentType="text/html; charset=ISO-8859-1" %>
<%@ taglib uri="http://www.tonbeller.com/jpivot" prefix="jp" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core" %>

<jp:mondrianQuery
    id="query01"
    jdbcDriver="com.mysql.jdbc.Driver"
    jdbcUrl="jdbc:mysql://localhost/dw_adventure?user=root&password="
    catalogUri="/WEB-INF/queries/DW_Adventure.xml">

select
  {[measures].[Total Penjualan], [measures].[Total Transaksi]} ON columns,
  {([Waktu].[Semua_Waktu], [Produk].[Semua_Produk], [Wilayah].[Semua_Wilayah], [Customer].[Semua_Customer])} ON rows
FROM [Sales]

</jp:mondrianQuery>

<c:set var="title01" scope="session">Query DWO Sales using Mondrian OLAP</c:set>
