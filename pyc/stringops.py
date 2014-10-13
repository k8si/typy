def count_words(string):
	words = string.split(" ")
	freq = {}
	for word in words:
		if not freq.has_key(word):
			freq[word] = 1
		else:
			freq[word] += 1
	return freq

if __name__ == "__main__":
	import sys
	string = sys.argv[1]
	word_freqs = count_words(string)
	for (k, v) in word_freqs.items():
		print k, v