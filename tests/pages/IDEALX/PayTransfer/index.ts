// pages/PaymentsPages.ts
import type { Page } from '@playwright/test';

import { AccountTransferPage } from './AccountTransferPage';
import { TransferCentersPage } from './TransferCenterPage';
import { PayrollPage } from './PayrollPage';
import { BulkPaymentPage } from './BulkPaymentPage';
import { BulkCollectionPage } from './BulkCollectionPage';


export {
  AccountTransferPage,
  TransferCentersPage,
  PayrollPage,
  BulkPaymentPage,
  BulkCollectionPage,
 /* LVTPaymentPage,
  AutoPayPaymentPage,
  PaymentViaPartnerBankPage,
  
  TelegraphicTransferPage,
  IntraCompanyTransferPage,
  FastPaymentPage,
  
  NewFastCollectionPage,
  BulkCollectionPage,
  
  MEPSPaymentPage,
  NewBillPaymentPage,
  PaymentTemplatesPage,
  BeneficiaryPage,
  CrossBoarderACHPage,
  HVTPaymentPage,
  CNAPSPaymentPage,
  HKCHATSPaymentPage,
  FPSPaymentPage,
  RTGSPaymentPage,
  SKNPaymentPage,
  ITTPage,
  NEFTPaymentPage,
  FixedDepositPlacementPage,
  PartnerBankPaymentPage,
  TWACHBulkPaymentPage,
  CustomPaymentPage,
  VNLvtPage,
  TWFISCPaymentPage,
  PaymentLimit,
  ChequePaymentPage,
  DemandDraftPaymentPage,
  MT101PaymentPage,
  GiroPaymentPage,
  eACHPaymentPage,
  IBPSPaymentPage,
  RTOLPaymentPage, */
};

export class PaymentsPages {
  public AccountTransferPage: AccountTransferPage;
  public TransferCentersPage: TransferCentersPage;
  public PayrollPage: PayrollPage;
  public BulkPaymentPage: BulkPaymentPage;
  public BulkCollectionPage: BulkCollectionPage;
  /*public LVTPaymentPage: LVTPaymentPage;
  public AutoPayPaymentPage: AutoPayPaymentPage;
  public PaymentViaPartnerBankPage: PaymentViaPartnerBankPage;
  public TelegraphicTransferPage: TelegraphicTransferPage;
  public IntraCompanyTransferPage: IntraCompanyTransferPage;
  public FastPaymentPage: FastPaymentPage;
  
  public NewFastCollectionPage: NewFastCollectionPage;
  public BulkCollectionPage: BulkCollectionPage;
  
  public MEPSPaymentPage: MEPSPaymentPage;
  public NewBillPaymentPage: NewBillPaymentPage;
  public PaymentTemplatesPage: PaymentTemplatesPage;
  public BeneficiaryPage: BeneficiaryPage;
  public CrossBoarderACHPage: CrossBoarderACHPage;
  public HVTPaymentPage: HVTPaymentPage;
  public CNAPSPaymentPage: CNAPSPaymentPage;
  public HKCHATSPaymentPage: HKCHATSPaymentPage;
  public FPSPaymentPage: FPSPaymentPage;
  public RTGSPaymentPage: RTGSPaymentPage;
  public SKNPaymentPage: SKNPaymentPage;
  public ITTPage: ITTPage;
  public NEFTPaymentPage: NEFTPaymentPage;
  public FixedDepositPlacementPage: FixedDepositPlacementPage;
  public PartnerBankPaymentPage: PartnerBankPaymentPage;
  public TWACHPaymentPage: TWACHBulkPaymentPage;
  public CustomPaymentPage: CustomPaymentPage;
  public VNLvtPage: VNLvtPage;
  public TWFISCPaymentPage: TWFISCPaymentPage;
  public PaymentLimit: PaymentLimit;
  public chequePaymentPage: ChequePaymentPage;
  public demandDraftPaymentPage: DemandDraftPaymentPage;
  public mt101PaymentPage: MT101PaymentPage;
  public giroPaymentPage: GiroPaymentPage;
  public eACHPaymentPage: eACHPaymentPage;
  public IBPSPaymentPage: IBPSPaymentPage;
  public RTOLPaymentPage: RTOLPaymentPage; */

  constructor(private readonly page: Page) {
    this.AccountTransferPage = new AccountTransferPage(page);
    this.TransferCentersPage = new TransferCentersPage(page);
    this.PayrollPage = new PayrollPage(page);
    this.BulkPaymentPage = new BulkPaymentPage(page);
    this.BulkCollectionPage = new BulkCollectionPage(page);

    /*this.LVTPaymentPage = new LVTPaymentPage(page);
    this.AutoPayPaymentPage = new AutoPayPaymentPage(page);
    this.PaymentViaPartnerBankPage = new PaymentViaPartnerBankPage(page);
    
    this.TelegraphicTransferPage = new TelegraphicTransferPage(page);
    this.IntraCompanyTransferPage = new IntraCompanyTransferPage(page);
    this.FastPaymentPage = new FastPaymentPage(page);
    
    this.NewFastCollectionPage = new NewFastCollectionPage(page);
    this.BulkCollectionPage = new BulkCollectionPage(page);
    
    this.MEPSPaymentPage = new MEPSPaymentPage(page);
    this.NewBillPaymentPage = new NewBillPaymentPage(page);
    this.PaymentTemplatesPage = new PaymentTemplatesPage(page);
    this.BeneficiaryPage = new BeneficiaryPage(page);
    this.CrossBoarderACHPage = new CrossBoarderACHPage(page);
    this.HVTPaymentPage = new HVTPaymentPage(page);
    this.CNAPSPaymentPage = new CNAPSPaymentPage(page);
    this.HKCHATSPaymentPage = new HKCHATSPaymentPage(page);
    this.FPSPaymentPage = new FPSPaymentPage(page);
    this.RTGSPaymentPage = new RTGSPaymentPage(page);
    this.SKNPaymentPage = new SKNPaymentPage(page);
    this.ITTPage = new ITTPage(page);
    this.NEFTPaymentPage = new NEFTPaymentPage(page);
    this.FixedDepositPlacementPage = new FixedDepositPlacementPage(page);
    this.PartnerBankPaymentPage = new PartnerBankPaymentPage(page);
    this.TWACHPaymentPage = new TWACHBulkPaymentPage(page);
    this.CustomPaymentPage = new CustomPaymentPage(page);
    this.VNLvtPage = new VNLvtPage(page);
    this.TWFISCPaymentPage = new TWFISCPaymentPage(page);
    this.PaymentLimit = new PaymentLimit(page);
    this.chequePaymentPage = new ChequePaymentPage(page);
    this.demandDraftPaymentPage = new DemandDraftPaymentPage(page);
    this.mt101PaymentPage = new MT101PaymentPage(page);
    this.giroPaymentPage = new GiroPaymentPage(page);
    this.eACHPaymentPage = new eACHPaymentPage(page);
    this.IBPSPaymentPage = new IBPSPaymentPage(page);
    this.RTOLPaymentPage = new RTOLPaymentPage(page); */
  }
}