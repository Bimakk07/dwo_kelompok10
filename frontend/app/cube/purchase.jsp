<%@ page session="true" contentType="text/html; charset=ISO-8859-1" %>
<%@ taglib uri="http://www.tonbeller.com/jpivot" prefix="jp" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core" %>

<jp:mondrianQuery
    id="query01"
    jdbcDriver="com.mysql.jdbc.Driver"
    jdbcUrl="jdbc:mysql://localhost/dw_adventure?user=root&password="
    catalogUri="/WEB-INF/queries/Purchase.xml">

select
  {[measures].[Total Pembelian], [measures].[Total Transaksi]} ON columns,
  {([Waktu].[Semua Waktu],[Vendor].[Semua Vendor],[Store].[Semua Store],[Produk].[Semua Produk])} ON rows
FROM [Purchase]

</jp:mondrianQuery>

<c:set var="title01" scope="session">Purchase OLAP adventureworks</c:set>
