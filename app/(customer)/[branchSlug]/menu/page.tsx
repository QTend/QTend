import { CustomerMenuInterface } from '@/components/customer/screen/CustomerMenuInterface';
import { getPublicItems } from '@/lib/getPublicItems';
import React from 'react'


export default async function page ({params} : {params: {branchSlug: string}})  {

  

  return <CustomerMenuInterface  />
}

