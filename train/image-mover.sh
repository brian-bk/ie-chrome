#!/usr/bin/env bash
# Super custom script to move images already downloaded around

rm data/train/googlechrome/*
rm data/train/notgooglechrome/*
rm data/validation/googlechrome/*
rm data/validation/notgooglechrome/*

for f in downloads/googlechrome-classified/yes/*
do
  hash=`md5sum "$f" | cut -d ' ' -f 1`
  if [[ $hash =~ ^[0-9a-b] ]]; then
    cp "$f" data/train/googlechrome/
  else
    cp "$f" data/validation/googlechrome/
  fi
done

for f in downloads/googlechrome-classified/no/*
do
  hash=`md5sum "$f" | cut -d ' ' -f 1`
  if [[ $hash =~ ^[0-9a-b] ]]; then
    cp "$f" data/train/notgooglechrome/
  else
    cp "$f" data/validation/notgooglechrome/
  fi
done

for f in downloads/notgooglechrome-classified/correct/*
do
  hash=`md5sum "$f" | cut -d ' ' -f 1`
  if [[ $hash =~ ^[0-9a-b] ]]; then
    cp "$f" data/train/notgooglechrome/
  else
    cp "$f" data/validation/notgooglechrome/
  fi
done
