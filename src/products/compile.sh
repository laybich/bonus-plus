for ((a = 1; a <= $(ls data | wc -l); a++))
do
mustache data/prodct$a.json prodct.mustache > prodct$a.html
done